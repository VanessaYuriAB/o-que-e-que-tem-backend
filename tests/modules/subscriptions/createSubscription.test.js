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

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de criação de assinatura
// requisição HTTP > celebrateForAccessToken > accessMiddleware > validateContentType > celebrateForCreateSubscription > createSubscription

describe('Create Subscription Flow > POST "/subscriptions"', () => {
  // ---------
  // Payloads
  // ---------

  const subscriptionPayload = {
    howLong: 'twelve',
    daysOn: ['seg', 'qua', 'sex'],
    schedules: {
      seg: '12:45',
      qua: '12:45',
      sex: '18:20',
    },
    method: 'drive-thru',

    pay: 'credito',
  };

  const loginPayload = {
    email: 'emaildavanessayuri@gmail.com',
    tel: '(11) 98950-2164',
    password: 'senha123',
  };

  // ------------------------------------------
  // Seed
  // Cadastro do usuário + login + accessToken
  // ------------------------------------------

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

    const login = await request.post('/auth/login').send(loginPayload);

    cookies = login.headers['set-cookie'];
  });

  // --------
  // Válidos
  // --------

  // 1
  it('Criação de assinatura (drive-thru, sem campos de endereço cadastrados) bem sucedida + persistência', async () => {
    // Assinatura
    const res = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(subscriptionPayload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    expect(res.body).toMatchObject({
      _id: expect.stringMatching(/^[0-9a-fA-F]{24}$/), // formato de ObjectId do Mongo DB

      userName: expect.any(String),
      email: expect.any(String),
      tel: expect.any(String),

      role: 'user',

      subscription: true,

      subscriptionDetails: {
        _id: expect.stringMatching(/^[0-9a-fA-F]{24}$/), // formato de ObjectId do Mongo DB

        owner: expect.stringMatching(/^[0-9a-fA-F]{24}$/), // formato de ObjectId do Mongo DB

        status: true,

        howLong: subscriptionPayload.howLong,
        daysOn: subscriptionPayload.daysOn,
        schedules: subscriptionPayload.schedules,
        method: subscriptionPayload.method,
        pay: subscriptionPayload.pay,

        endAt: expect.any(String),

        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });

    expect(res.body).not.toHaveProperty('password');

    expect(res.body.userName).toBe('Vanessa Yuri A. Brito');
    expect(res.body.email).toBe('emaildavanessayuri@gmail.com');
    expect(res.body.tel).toBe('(11) 98950-2164');

    expect(Date.parse(res.body.subscriptionDetails.endAt)).not.toBeNaN();
    expect(new Date(res.body.subscriptionDetails.endAt).toString()).not.toBe(
      'Invalid Date',
    );

    // Persistência
    const user = await UserModel.findOne({
      email: loginPayload.email,
    });
    expect(user).not.toBeNull();

    expect(user.subscription).toBe(true);
    expect(user.subscriptionDetails).toBeDefined();

    const createdSubscription = await SubscriptionModel.findOne({
      owner: user._id,
    });

    expect(createdSubscription).not.toBeNull();

    expect(createdSubscription.owner.equals(user._id)).toBe(true); // dois ObjectIds do Mongoose

    expect(createdSubscription.status).toBe(true);
    expect(createdSubscription.howLong).toBe(subscriptionPayload.howLong);
    expect(createdSubscription.daysOn).toEqual(subscriptionPayload.daysOn);
    expect(Object.fromEntries(createdSubscription.schedules)).toEqual(
      subscriptionPayload.schedules,
    );
    expect(createdSubscription.method).toBe(subscriptionPayload.method);
    expect(createdSubscription.pay).toBe(subscriptionPayload.pay);

    expect(createdSubscription.createdAt).toBeDefined();
    expect(createdSubscription.updatedAt).toBeDefined();

    expect(createdSubscription.endAt).toBeDefined();
    expect(createdSubscription.endAt).toBeInstanceOf(Date);
  });

  // 2
  it('Criação de assinatura (delivery, com campos de endereço cadastrados) bem sucedida', async () => {
    // Seed (atualização de perfil cadastral)
    await request.patch('/users/me').set('Cookie', cookies).send({
      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      address: 'Rua tal',
      number: '123',
      complement: 'Apto 456',
      district: 'Bairro tal',
      cep: '12345-678',
      infoText: 'Observação tal',
    });

    // Teste
    const payload = {
      ...subscriptionPayload,
      method: 'delivery',
    };

    const res = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    expect(res.body.subscription).toBe(true);

    expect(res.body.subscriptionDetails.method).toBe('delivery');
  });

  // 3
  it('Aceita assinatura drive-thru com endereço cadastrado', async () => {
    // Seed (atualização de perfil cadastral)
    await request.patch('/users/me').set('Cookie', cookies).send({
      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      address: 'Rua tal',
      number: '123',
      complement: 'Apto 456',
      district: 'Bairro tal',
      cep: '12345-678',
      infoText: 'Observação tal',
    });

    // Teste
    const payload = {
      ...subscriptionPayload,
      method: 'drive-thru',
    };

    const res = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    expect(res.body.subscription).toBe(true);

    expect(res.body.subscriptionDetails.method).toBe('drive-thru');
  });

  // 4
  it('Aceita assinatura drive-thru com endereço vazio', async () => {
    // Seed (atualização de perfil cadastral)
    await request.patch('/users/me').set('Cookie', cookies).send({
      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      address: '',
      number: '',
      complement: '',
      district: '',
      cep: '',
      infoText: '',
    });

    const res = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(subscriptionPayload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    expect(res.body.address).toBe('');
    expect(res.body.number).toBe('');
    expect(res.body.complement).toBe('');
    expect(res.body.district).toBe('');
    expect(res.body.cep).toBe('');
    expect(res.body.infoText).toBe('');
  });

  // ------------------------
  // celebrateForAccessToken
  // ------------------------

  // 5
  it('Exige accessToken', async () => {
    const error = await request.post('/subscriptions');

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 6
  it('accessToken fora do padrão JWT', async () => {
    const error = await request
      .post('/subscriptions')
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

  // 7
  it('accessToken expirado', async () => {
    const expiredToken = jwt.sign(
      { _id: '123', role: 'user' },
      env.JWT_SECRET,
      { expiresIn: '-1s' }, // token é gerado já expirado
    );

    const error = await request
      .post('/subscriptions')
      .set('Cookie', `accessToken=${expiredToken}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body.message).toBe(
      `${errorsMessages.unauthorized} Erro na autenticação do usuário: accessToken inválido.`,
    );
  });

  // 8
  it('accessToken assinado com chave inválida', async () => {
    const invalidToken = jwt.sign(
      { _id: '123', role: 'user' },
      'chave-errada',
      {
        expiresIn: '15m',
      },
    );

    const error = await request
      .post('/subscriptions')
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

  // 9
  it('Content-Type inválido', async () => {
    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .set('Content-Type', 'text/plain')
      .send('teste de header content-type');

    // pq com '.send(subscriptionPayload)', o Supertest envia JSON automaticamente, adicionando 'Content-Type: application/json' implicitamente

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(415);

    expect(error.body.message).toBe(
      `${errorsMessages.unsupportedMediaType} Content-Type deve ser application/json.`,
    );
  });

  // ------------------------------------------
  // celebrateForCreateSubscription (required)
  // ------------------------------------------

  // 10
  it('Exige howLong', async () => {
    const payload = { ...subscriptionPayload };

    delete payload.howLong;

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 11
  it('Exige daysOn', async () => {
    const payload = { ...subscriptionPayload };

    delete payload.daysOn;

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 12
  it('Exige schedules', async () => {
    const payload = { ...subscriptionPayload };

    delete payload.schedules;

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 13
  it('Exige method', async () => {
    const payload = { ...subscriptionPayload };

    delete payload.method;

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 14
  it('Exige pay', async () => {
    const payload = { ...subscriptionPayload };

    delete payload.pay;

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------------------------
  // celebrateForCreateSubscription (enum)
  // --------------------------------------

  // 15
  it('howLong fora do enum', async () => {
    const payload = {
      ...subscriptionPayload,
      howLong: 'vinte-meses',
    };

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 16
  it('daysOn fora do enum', async () => {
    const payload = {
      ...subscriptionPayload,
      daysOn: ['domingo'],
    };

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 17
  it('method fora do enum', async () => {
    const payload = {
      ...subscriptionPayload,
      method: 'motoboy',
    };

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 18
  it('pay fora do enum', async () => {
    const payload = {
      ...subscriptionPayload,
      pay: 'boleto',
    };

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ----------------------------------------
  // celebrateForCreateSubscription (daysOn)
  // ----------------------------------------

  // 19
  it('daysOn não permite itens duplicados', async () => {
    const payload = {
      ...subscriptionPayload,
      daysOn: ['seg', 'seg'],
    };

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 20
  it('daysOn deve ser um array', async () => {
    const payload = {
      ...subscriptionPayload,
      daysOn: 'seg',
    };

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -------------------------------------------
  // celebrateForCreateSubscription (schedules)
  // -------------------------------------------

  // 21
  it('schedules não permite propriedades desconhecidas', async () => {
    const payload = {
      ...subscriptionPayload,
      schedules: {
        seg: '12:45',
        sab: '16:00',
      },
    };

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 22
  it('schedules exige horário em formato válido', async () => {
    const payload = {
      ...subscriptionPayload,
      schedules: {
        seg: '16h40',
      },
    };

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -------------------------------------------------
  // Cobertura de pre('validate'): subscriptionSchema
  // -------------------------------------------------

  // 23
  it('Todos os dias precisam possuir horário', async () => {
    const payload = {
      ...subscriptionPayload,
      schedules: {
        seg: '12:45',
        qua: '12:45',
      },
    };

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message:
        'Os dias selecionados e os horários informados devem corresponder exatamente.',
    });
  });

  // 24
  it('Todos os horários precisam constar em dias', async () => {
    const payload = {
      ...subscriptionPayload,
      daysOn: ['seg', 'qua'],
    };

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body.message).toBe(
      'Os dias selecionados e os horários informados devem corresponder exatamente.',
    );
  });

  // Cálculo de 'endAt' incluso no teste de sucesso

  // ---------------
  // Conflict (409)
  // ---------------

  // 25
  it('Criação de assinatura mal sucedida (409)', async () => {
    // Seed de assinatura
    const a = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(subscriptionPayload);

    expect(a.statusCode).toBe(201);

    // Teste
    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(subscriptionPayload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(409);

    expect(error.body.message).toBe(
      `${errorsMessages.conflict} Proprietário de assinatura duplicado.`,
    );
  });

  // -----------------
  // BadRequest (400)
  // -----------------

  // 26
  // Tratamento pelo próprio controller, neste fluxo, a validação acontece antes do pre('validate') do schema, para a persistência do modelo
  it('Delivery exige endereço completo no perfil do usuário', async () => {
    const payload = {
      ...subscriptionPayload,
      method: 'delivery',
    };

    const error = await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body.message).toBe(
      `${errorsMessages.badRequest} Erro ao criar assinatura: assinantes com entrega delivery devem possuir endereço completo.`,
    );
  });
});
