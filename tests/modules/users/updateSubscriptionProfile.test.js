// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import jwt from 'jsonwebtoken';
import env from '../../../src/config/env.js';
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';
import UserModel from '../../../src/modules/users/user.model.js';
import SubscriptionModel from '../../../src/modules/subscriptions/subscription.model.js';
import mongoose from 'mongoose';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de atualização de configuração de assinatura
// requisição HTTP > celebrateForAccessToken > accessMiddleware > validateContentType > celebrateForUpdateSubscription > updateSubscriptionProfile

describe('Update Subscription Profile Flow > PATCH "/users/subscriptions/me"', () => {
  // --------
  // Payload
  // --------

  const updateSubscriptionPayload = {
    daysOn: ['seg', 'qua'],
    schedules: {
      seg: '12:45',
      qua: '12:45',
    },
    method: 'delivery',
  };

  // -------------------------------------------------------------------
  // Seed
  // Cadastro do usuário + login + accessToken + cadastro de assinatura
  // -------------------------------------------------------------------

  let cookies;

  beforeEach(async () => {
    await request.post('/auth/register').send({
      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      confirmEmail: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      password: 'senha123',
      confirmPassword: 'senha123',
    });

    const login = await request.post('/auth/login').send({
      email: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      password: 'senha123',
    });

    cookies = login.headers['set-cookie'];

    await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send({
        userName: 'Vanessa Yuri A. Brito',
        email: 'emaildavanessayuri@gmail.com',
        confirmEmail: 'emaildavanessayuri@gmail.com',
        tel: '(11) 98950-2164',

        howLong: 'twelve',
        daysOn: ['seg', 'qua', 'sex'],
        schedules: {
          seg: '12:45',
          qua: '12:45',
          sex: '18:20',
        },
        method: 'drive-thru',

        pay: 'credito',
      });
  });

  // --------
  // Válidos
  // --------

  // 1
  it('Atualização de assinatura bem sucedida + persistência', async () => {
    // Teste
    const res = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', cookies)
      .send(updateSubscriptionPayload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(res.body).toMatchObject({
      _id: expect.stringMatching(/^[0-9a-fA-F]{24}$/), // formato de ObjectId do Mongo DB

      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',

      role: 'user',

      subscription: true,

      subscriptionDetails: {
        owner: expect.stringMatching(/^[0-9a-fA-F]{24}$/), // formato de ObjectId do Mongo DB

        status: true,

        howLong: 'twelve',
        daysOn: updateSubscriptionPayload.daysOn,
        schedules: updateSubscriptionPayload.schedules,
        method: updateSubscriptionPayload.method,
        pay: 'credito',
      },
    });

    // Persistência
    const user = await UserModel.findOne({
      email: res.body.email,
    });

    expect(user).not.toBeNull();

    const updatedSubscription = await SubscriptionModel.findOne({
      owner: user._id,
    });

    expect(updatedSubscription).not.toBeNull();

    expect(updatedSubscription.owner.equals(user._id)).toBe(true); // dois ObjectIds do Mongoose

    expect(updatedSubscription.status).toBe(true);

    expect(updatedSubscription.daysOn).toEqual(
      updateSubscriptionPayload.daysOn,
    );
    expect(Object.fromEntries(updatedSubscription.schedules)).toEqual(
      updateSubscriptionPayload.schedules,
    );
    expect(updatedSubscription.method).toBe(updateSubscriptionPayload.method);

    expect(updatedSubscription.createdAt).toBeDefined();
    expect(updatedSubscription.updatedAt).toBeDefined();

    expect(updatedSubscription.updatedAt).not.toEqual(
      updatedSubscription.createdAt,
    );
  });

  // 2
  it('Pausa de assinatura bem sucedida + persistência', async () => {
    // Teste
    const res = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', cookies)
      .send({
        status: false,
      });

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(res.body).toMatchObject({
      _id: expect.stringMatching(/^[0-9a-fA-F]{24}$/), // formato de ObjectId do Mongo DB

      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',

      role: 'user',

      subscription: true,

      subscriptionDetails: {
        owner: expect.stringMatching(/^[0-9a-fA-F]{24}$/), // formato de ObjectId do Mongo DB

        status: false,
      },
    });

    // Persistência
    const user = await UserModel.findOne({
      email: res.body.email,
    });

    expect(user).not.toBeNull();

    const updatedSubscription = await SubscriptionModel.findOne({
      owner: user._id,
    });

    expect(updatedSubscription).not.toBeNull();

    expect(updatedSubscription.owner.equals(user._id)).toBe(true); // dois ObjectIds do Mongoose

    expect(updatedSubscription.status).toBe(false);

    expect(updatedSubscription.createdAt).toBeDefined();
    expect(updatedSubscription.updatedAt).toBeDefined();

    expect(updatedSubscription.updatedAt).not.toEqual(
      updatedSubscription.createdAt,
    );
  });

  // ------------------------
  // celebrateForAccessToken
  // ------------------------

  // 3
  it('Exige accessToken', async () => {
    const error = await request.patch('/users/subscriptions/me');

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 4
  it('accessToken fora do padrão JWT', async () => {
    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', 'accessToken=token-invalido');

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -----------------
  // accessMiddleware
  // -----------------

  // 5
  it('accessToken expirado', async () => {
    const expiredToken = jwt.sign(
      { _id: '123', role: 'user' },
      env.JWT_SECRET,
      { expiresIn: '-1s' }, // token é gerado já expirado
    );

    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', `accessToken=${expiredToken}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body.message).toBe(
      `${errorsMessages.unauthorized} Erro na autenticação do usuário: accessToken inválido.`,
    );
  });

  // 6
  it('accessToken assinado com chave inválida', async () => {
    const invalidToken = jwt.sign(
      { _id: '123', role: 'user' },
      'chave-errada',
      {
        expiresIn: '15m',
      },
    );

    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', `accessToken=${invalidToken}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body.message).toBe(
      `${errorsMessages.unauthorized} Erro na autenticação do usuário: accessToken inválido.`,
    );
  });

  // --------------------
  // validateContentType
  // --------------------

  // 7
  it('Content-Type inválido', async () => {
    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', cookies)
      .set('Content-Type', 'text/plain')
      .send('teste de header content-type');

    // pq com '.send(updateSubscriptionPayload)', o Supertest envia JSON automaticamente, adicionando 'Content-Type: application/json' implicitamente

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(415);

    expect(error.body.message).toBe(
      `${errorsMessages.unsupportedMediaType} Content-Type deve ser application/json.`,
    );
  });

  // --------------------------------------
  // celebrateForUpdateSubscription (enum)
  // --------------------------------------

  // 8
  it('daysOn fora do enum', async () => {
    const payload = {
      ...updateSubscriptionPayload,
      daysOn: ['domingo'],
    };

    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 9
  it('method fora do enum', async () => {
    const payload = {
      ...updateSubscriptionPayload,
      method: 'motoboy',
    };

    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ----------------------------------------
  // celebrateForUpdateSubscription (daysOn)
  // ----------------------------------------

  // 10
  it('daysOn não permite itens duplicados', async () => {
    const payload = {
      ...updateSubscriptionPayload,
      daysOn: ['seg', 'seg'],
    };

    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 11
  it('daysOn deve ser um array', async () => {
    const payload = {
      ...updateSubscriptionPayload,
      daysOn: 'seg',
    };

    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -------------------------------------------
  // celebrateForUpdateSubscription (schedules)
  // -------------------------------------------

  // 12
  it('schedules não permite propriedades desconhecidas', async () => {
    const payload = {
      ...updateSubscriptionPayload,
      schedules: {
        seg: '12:45',
        sab: '16:00',
      },
    };

    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 13
  it('schedules exige horário em formato válido', async () => {
    const payload = {
      ...updateSubscriptionPayload,
      schedules: {
        seg: '16h40',
      },
    };

    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -------------------------------------------------------------
  // celebrateForUpdateSubscription: cobertura do pre('validate')
  // -------------------------------------------------------------

  // 14
  it('Todos os dias precisam possuir horário', async () => {
    const payload = {
      ...updateSubscriptionPayload,
      schedules: {
        seg: '12:45',
      },
    };

    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message:
        'Os dias selecionados e os horários informados devem corresponder exatamente.',
    });
  });

  // 15
  it('Todos os horários precisam constar em dias', async () => {
    const payload = {
      ...updateSubscriptionPayload,
      schedules: {
        seg: '12:45',
        qua: '12:45',
        sex: '18:20',
      },
    };

    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body.message).toBe(
      'Os dias selecionados e os horários informados devem corresponder exatamente.',
    );
  });

  // ----------------------------------------
  // celebrateForUpdateSubscription (status)
  // ----------------------------------------

  // 16
  it('status deve ser um boleano', async () => {
    const payload = {
      status: 'pausado',
    };

    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ----------------------------------------
  // celebrateForUpdateSubscription (min(1))
  // ----------------------------------------

  // 17
  it('Body ausente', async () => {
    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', cookies)
      .send({});

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------
  // NotFoundError (404)
  // --------------------

  // 18
  it('Atualização de assinatura mal sucedida', async () => {
    // Gera token válido com _id inexistente
    const fakeToken = jwt.sign(
      {
        _id: new mongoose.Types.ObjectId(),
        role: 'user',
      },
      env.JWT_SECRET,
      {
        expiresIn: '15m',
      },
    );

    const error = await request
      .patch('/users/subscriptions/me')
      .set('Cookie', `accessToken=${fakeToken}`)
      .send(updateSubscriptionPayload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(404);

    expect(error.body.message).toBe(
      `${errorsMessages.notFound} Erro ao atualizar perfil de assinatura: não existe assinatura para o id solicitado (Recurso não encontrado).`,
    );
  });
});
