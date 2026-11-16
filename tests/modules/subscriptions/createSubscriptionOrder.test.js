// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import UserModel from '../../../src/modules/users/user.model.js';
import SubscriptionOrderModel from '../../../src/modules/subscriptions/subscription-order.model.js';
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';
import jwt from 'jsonwebtoken';
import env from '../../../src/config/env.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de cadastro de pedido de assinatura
// requisição HTTP > celebrateForAccessToken > accessMiddleware > validateContentType > celebrateForCreateSubscriptionOrder > createSubscriptionOrder > DB

describe('Create Subscription Order Flow > POST "/subscriptions/orders"', () => {
  // --------
  // Payload
  // --------

  const subscriptionOrderPayload = {
    meal: 'sopa',
    method: 'delivery',

    day: '2026-11-18T00:00:00.000Z', // new Date().toISOString()
    time: '12:45',

    customerSnapshot: {
      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
    },

    addressSnapshot: {
      address: 'Rua tal',
      number: '123',
      complement: 'Apto 456',
      district: 'Bairro tal',
      cep: '12345-678',
    },

    itemsSnapshot: [
      {
        _id: '6ae9229e9ce3cad3dcc9ba13',
        productName: 'Abóbora',
        category: 'verduras-legumes',
        partnerName: 'Mercado 1',
      },
      {
        _id: '6ae9229e9ce3cad3dcc9ba14',
        productName: 'Espinafre',
        category: 'verduras-legumes',
        partnerName: 'Mercado 2',
      },
    ],

    obs: 'Próximo à estação de metrô.',
  };

  // ---------------------------------------------------------------------------------
  // Seed
  // Cadastro do usuário + login + accessToken + atualização de cadastro + assinatura
  // ---------------------------------------------------------------------------------

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

    // Atualiza perfil do usuário para cadastro de endereço, conforme fluxo de assinatura no frontend
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
          seg: '18:20',
          qua: '12:45',
          sex: '18:20',
        },
        method: 'drive-thru',

        pay: 'credito',
      });
  });

  // -------
  // Válido
  // -------

  // 1
  it('Cadastro com sucesso + persistência', async () => {
    const res = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(subscriptionOrderPayload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    expect(res.body.owner).toBeDefined();
    expect(res.body.owner).toMatch(/^[0-9a-fA-F]{24}$/);

    expect(res.body.orderNumber).toBeDefined();
    expect(res.body.orderNumber).toMatch(/^S\d{12}$/);

    expect(res.body).toMatchObject(
      expect.objectContaining(subscriptionOrderPayload),
    );

    expect(res.body.createdAt).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();

    // Persistência
    const user = await UserModel.findOne({
      email: subscriptionOrderPayload.customerSnapshot.email,
    });

    expect(user).not.toBeNull();
    expect(user.email).toBe(subscriptionOrderPayload.customerSnapshot.email);

    const subscriptionOrder = await SubscriptionOrderModel.findOne({
      owner: user._id,
    });

    expect(subscriptionOrder).not.toBeNull();
    expect(subscriptionOrder.owner.toString()).toBe(user._id.toString());

    expect(subscriptionOrder.customerSnapshot.email).toBe(
      subscriptionOrderPayload.customerSnapshot.email,
    );

    expect(subscriptionOrder._id.toString()).toMatch(/^[0-9a-fA-F]{24}$/); // formato de ObjectId do Mongo DB
    expect(subscriptionOrder.orderNumber).toEqual(expect.any(String));
    expect(subscriptionOrder.orderNumber).toHaveLength(13);
    expect(subscriptionOrder.orderNumber).toMatch(/^S\d{12}$/);
  });

  // ------------------------
  // celebrateForAccessToken
  // ------------------------

  // 2
  it('Exige accessToken', async () => {
    const error = await request.post('/subscriptions/orders');

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 3
  it('accessToken fora do padrão JWT', async () => {
    const error = await request
      .post('/subscriptions/orders')
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

  // 4
  it('accessToken expirado', async () => {
    const expiredToken = jwt.sign(
      { _id: '123', role: 'user' },
      env.JWT_SECRET,
      { expiresIn: '-1s' }, // token é gerado já expirado
    );

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', `accessToken=${expiredToken}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body.message).toBe(
      `${errorsMessages.unauthorized} Erro na autenticação do usuário: accessToken inválido.`,
    );
  });

  // 5
  it('accessToken assinado com chave inválida', async () => {
    const invalidToken = jwt.sign(
      { _id: '123', role: 'user' },
      'chave-errada',
      {
        expiresIn: '15m',
      },
    );

    const error = await request
      .post('/subscriptions/orders')
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

  // 6
  it('Content-Type inválido', async () => {
    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .set('Content-Type', 'text/plain')
      .send('teste de header content-type');

    // pq com '.send(subscriptionOrderPayload)', o Supertest envia JSON automaticamente, adicionando 'Content-Type: application/json' implicitamente

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(415);

    expect(error.body.message).toBe(
      `${errorsMessages.unsupportedMediaType} Content-Type deve ser application/json.`,
    );
  });

  // -----------------------------------------------
  // celebrateForCreateSubscriptionOrder (required)
  // -----------------------------------------------

  // 7
  it('Exige meal', async () => {
    const payload = { ...subscriptionOrderPayload };
    delete payload.meal;

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 8
  it('Exige method', async () => {
    const payload = { ...subscriptionOrderPayload };
    delete payload.method;

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 9
  it('Exige day', async () => {
    const payload = { ...subscriptionOrderPayload };
    delete payload.day;

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 10
  it('Exige time', async () => {
    const payload = { ...subscriptionOrderPayload };
    delete payload.time;

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 11
  it('Exige customerSnapshot ({userName, email, tel})', async () => {
    const payload = { ...subscriptionOrderPayload };
    delete payload.customerSnapshot;

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 12
  it('Exige itemsSnapshot ([{_id, productName, category, partnerName}])', async () => {
    const payload = { ...subscriptionOrderPayload };
    delete payload.itemsSnapshot;

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------------------------------------------------
  // celebrateForCreateSubscriptionOrder (when/is/then + required)
  // --------------------------------------------------------------

  // 13
  it('delivery exige addressSnapshot ({address, number, complement, district, cep})', async () => {
    const payload = { ...subscriptionOrderPayload };
    delete payload.addressSnapshot;

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 14
  it('Aceita drive-thru com addressSnapshot ({address, number, complement, district, cep})', async () => {
    const payload = { ...subscriptionOrderPayload, method: 'drive-thru' };

    const res = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);
  });

  // 15
  it('Aceita drive-thru sem addressSnapshot ({address, number, complement, district, cep})', async () => {
    const payload = { ...subscriptionOrderPayload, method: 'drive-thru' };
    delete payload.addressSnapshot;

    const res = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);
  });

  // --------------------------------------------
  // celebrateForCreateSubscriptionOrder (valid)
  // --------------------------------------------

  // 16
  it('Rejeita meal inválido', async () => {
    const payload = { ...subscriptionOrderPayload, meal: 'risoto' };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 17
  it('Rejeita method inválido', async () => {
    const payload = { ...subscriptionOrderPayload, method: 'motoboy' };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 18
  it('Rejeita itemsSnapshot.category inválido', async () => {
    const payload = {
      ...subscriptionOrderPayload,
      itemsSnapshot: [
        {
          ...subscriptionOrderPayload.itemsSnapshot[0],
          category: 'tempero',
        },
      ],
    };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -------------------------------------------
  // celebrateForCreateSubscriptionOrder (time)
  // -------------------------------------------

  // 19
  it('Rejeita time após 19:45', async () => {
    const payload = { ...subscriptionOrderPayload, time: '19:46' };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 20
  it('Rejeita time antes das 10:45', async () => {
    const payload = { ...subscriptionOrderPayload, time: '10:44' };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ----------------------------------------------
  // celebrateForCreateSubscriptionOrder (pattern)
  // ----------------------------------------------

  // 21
  it('Rejeita time em formato inválido pela regex', async () => {
    const payload = { ...subscriptionOrderPayload, time: '12h45' };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 22
  it('Rejeita customerSnapshot.userName com formato inválido, contendo HTML básico (< e >)', async () => {
    const payload = {
      ...subscriptionOrderPayload,
      customerSnapshot: {
        ...subscriptionOrderPayload.customerSnapshot,
        userName: '<Vanessa Yuri A. Brito>',
      },
    };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 23
  it('Rejeita customerSnapshot.tel com formato inválido, regex para (XX) XXXXX-XXXX', async () => {
    const payload = {
      ...subscriptionOrderPayload,
      customerSnapshot: {
        ...subscriptionOrderPayload.customerSnapshot,
        tel: '11 989502164',
      },
    };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 24
  it('Rejeita addressSnapshot.address com formato inválido, contendo HTML básico (< e >)', async () => {
    const payload = {
      ...subscriptionOrderPayload,
      addressSnapshot: {
        ...subscriptionOrderPayload.addressSnapshot,
        address: '<Rua tal>',
      },
    };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 25
  it('Rejeita addressSnapshot.number com formato inválido, são aceitos: letras, números e espaços em branco', async () => {
    const payload = {
      ...subscriptionOrderPayload,
      addressSnapshot: {
        ...subscriptionOrderPayload.addressSnapshot,
        number: '20 Á',
      },
    };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 26
  it('Rejeita addressSnapshot.complement com formato inválido, são aceitos: letras, números, espaços em branco, pontos finais e traços', async () => {
    const payload = {
      ...subscriptionOrderPayload,
      addressSnapshot: {
        ...subscriptionOrderPayload.addressSnapshot,
        complement: '@pto 40',
      },
    };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 27
  it('Rejeita addressSnapshot.district com formato inválido, são aceitos: letras, acentos, números e espaços em branco', async () => {
    const payload = {
      ...subscriptionOrderPayload,
      addressSnapshot: {
        ...subscriptionOrderPayload.addressSnapshot,
        district: 'Bairro tal.',
      },
    };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 28
  it('Rejeita addressSnapshot.cep com formato inválido, regex para XXXXX-XXX', async () => {
    const payload = {
      ...subscriptionOrderPayload,
      addressSnapshot: {
        ...subscriptionOrderPayload.addressSnapshot,
        cep: '12345678',
      },
    };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 29
  it('Rejeita obs com formato inválido, contendo HTML básico (< e >)', async () => {
    const payload = {
      ...subscriptionOrderPayload,
      obs: '<Próximo à estação de metrô.>',
    };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------------------------------
  // celebrateForCreateSubscriptionOrder (email)
  // --------------------------------------------

  // 30
  it('Rejeita email inválido', async () => {
    const payload = {
      ...subscriptionOrderPayload,
      customerSnapshot: {
        ...subscriptionOrderPayload.customerSnapshot,
        email: 'email-invalido',
      },
    };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------------------------------
  // celebrateForCreateSubscriptionOrder (allow)
  // --------------------------------------------

  // 31
  it('Aceita obs vazio ("")', async () => {
    const payload = {
      ...subscriptionOrderPayload,
      obs: '',
    };

    const res = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    expect(res.body.obs).toBe('');
  });

  // ----------------------------------------------------
  // celebrateForCreateSubscriptionOrder (itemsSnapshot)
  // ----------------------------------------------------

  it('Rejeita itemsSnapshot vazio', async () => {
    const payload = {
      ...subscriptionOrderPayload,
      itemsSnapshot: [],
    };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ------------------------------------------
  // celebrateForCreateSubscriptionOrder (day)
  // ------------------------------------------

  it('Rejeita day inválido', async () => {
    const payload = {
      ...subscriptionOrderPayload,
      day: 'amanhã depois do almoço',
    };

    const error = await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });
});
