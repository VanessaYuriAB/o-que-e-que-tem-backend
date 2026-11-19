// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import SubscriptionOrderModel from '../../../src/modules/subscriptions/subscription-order.model.js';
import jwt from 'jsonwebtoken';
import env from '../../../src/config/env.js';
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';
import UserModel from '../../../src/modules/users/user.model.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de busca de pedidos de assinatura do usuário
// requisição HTTP > celebrateForAccessToken > celebrateForGetUserSubscriptionOrders > accessMiddleware > isOwnerOrAdminMiddleware > getUserSubscriptionOrders

describe('Get User Subscription Orders Flow > GET "/users/:userId/subscriptions/orders"', () => {
  // -----------------------------------------------
  // Seed
  // Cadastro do usuário + login
  // access e refresh Tokens + refreshUser (id)
  // Cadastro de assinatura + pedido de assinatura
  // -----------------------------------------------

  let cookies;
  let userId;

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

    const refresh = await request.get('/auth/me').set('Cookie', cookies);

    userId = refresh.body._id;

    await request
      .post('/subscriptions')
      .set('Cookie', cookies)
      .send({
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

    await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send({
        meal: 'sopa',
        method: 'drive-thru',

        day: '2026-11-23',
        time: '12:45',

        customerSnapshot: {
          userName: 'Vanessa Yuri A. Brito',
          email: 'emaildavanessayuri@gmail.com',
          tel: '(11) 98950-2164',
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

        obs: '',
      });
  });

  // --------
  // Válidos
  // --------

  // 1
  it('Retorna histórico de pedidos de assinatura do usuário', async () => {
    const res = await request
      .get(`/users/${userId}/subscriptions/orders`)
      .set('Cookie', cookies);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).not.toHaveLength(0);

    expect(res.body).toHaveLength(1);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.stringMatching(/^[0-9a-fA-F]{24}$/), // formato de ObjectId do Mongo DB

          owner: userId,
          orderNumber: expect.stringMatching(/^S\d{12}$/),

          meal: 'sopa',
          method: 'drive-thru',

          day: '2026-11-23T00:00:00.000Z',
          time: '12:45',

          customerSnapshot: expect.objectContaining({
            userName: 'Vanessa Yuri A. Brito',
            email: 'emaildavanessayuri@gmail.com',
            tel: '(11) 98950-2164',
          }),

          itemsSnapshot: expect.arrayContaining([
            expect.objectContaining({
              _id: '6ae9229e9ce3cad3dcc9ba13',
              productName: 'Abóbora',
              category: 'verduras-legumes',
              partnerName: 'Mercado 1',
            }),
            expect.objectContaining({
              _id: '6ae9229e9ce3cad3dcc9ba14',
              productName: 'Espinafre',
              category: 'verduras-legumes',
              partnerName: 'Mercado 2',
            }),
          ]),

          obs: '',

          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    );
  });

  // 2
  it('Retorna array vazio quando não houver pedido de assinatura cadastrado', async () => {
    await SubscriptionOrderModel.deleteMany({});

    const res = await request
      .get(`/users/${userId}/subscriptions/orders`)
      .set('Cookie', cookies);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual([]);
  });

  // 3
  it('Retorna pedidos ordenados do mais recente para o mais antigo', async () => {
    // Seed (2º pedido de assinatura)
    await request
      .post('/subscriptions/orders')
      .set('Cookie', cookies)
      .send({
        meal: 'creme',
        method: 'drive-thru',

        day: '2026-11-25',
        time: '12:45',

        customerSnapshot: {
          userName: 'Vanessa Yuri A. Brito',
          email: 'emaildavanessayuri@gmail.com',
          tel: '(11) 98950-2164',
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

        obs: '',
      });

    // Teste
    const res = await request
      .get(`/users/${userId}/subscriptions/orders`)
      .set('Cookie', cookies);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);

    expect(res.body[0].createdAt >= res.body[1].createdAt).toBe(true);
  });

  // ------------------------
  // celebrateForAccessToken
  // ------------------------

  // 4
  it('Exige accessToken', async () => {
    const error = await request.get(`/users/${userId}/subscriptions/orders`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 5
  it('accessToken fora do padrão JWT (inválido)', async () => {
    const error = await request
      .get(`/users/${userId}/subscriptions/orders`)
      .set('Cookie', 'accessToken=token-invalido');

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -----------------------------------------------
  // celebrateForGetUserSubscriptionOrders (params)
  // -----------------------------------------------

  // 6
  it('userId deve possuir formato válido de ObjectId', async () => {
    const error = await request
      .get('/users/id-invalido/subscriptions/orders')
      .set('Cookie', cookies);

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
      .get(`/users/${userId}/subscriptions/orders`)
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
      .get(`/users/${userId}/subscriptions/orders`)
      .set('Cookie', `accessToken=${invalidToken}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body.message).toBe(
      `${errorsMessages.unauthorized} Erro na autenticação do usuário: accessToken inválido.`,
    );
  });

  // -------------------------
  // isOwnerOrAdminMiddleware
  // -------------------------

  // 9
  it('Bloqueia acesso a pedidos de assinatura de outro usuário', async () => {
    // Seed (usuário B)
    // Cadastro + login + access e refresh Tokens + refreshUser (id) + cadastro de assinatura + cadastro de pedido de assinatura
    await request.post('/auth/register').send({
      userName: 'User B',
      email: 'userb@gmail.com',
      confirmEmail: 'userb@gmail.com',
      tel: '(11) 98765-4321',
      password: 'senha456',
      confirmPassword: 'senha456',
    });

    const login = await request.post('/auth/login').send({
      email: 'userb@gmail.com',
      tel: '(11) 98765-4321',
      password: 'senha456',
    });

    const cookiesB = login.headers['set-cookie'];

    const refresh = await request.get('/auth/me').set('Cookie', cookiesB);

    const userIdB = refresh.body._id;

    await request
      .post('/subscriptions')
      .set('Cookie', cookiesB)
      .send({
        howLong: 'four',
        daysOn: ['seg', 'sex'],
        schedules: {
          seg: '14:50',
          sex: '14:50',
        },
        method: 'drive-thru',

        pay: 'pix',
      });

    await request
      .post('/subscriptions/orders')
      .set('Cookie', cookiesB)
      .send({
        meal: 'pate',
        method: 'drive-thru',

        day: '2026-11-23',
        time: '14:50',

        customerSnapshot: {
          userName: 'User B',
          email: 'userb@gmail.com',
          tel: '(11) 98765-4321',
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

        obs: '',
      });

    // Teste
    const error = await request
      .get(`/users/${userIdB}/subscriptions/orders`)
      .set('Cookie', cookies);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(403);

    expect(error.body.message).toBe(
      `${errorsMessages.forbidden} Acesso negado.`,
    );
  });

  // 10
  it('admin pode acessar pedidos de qualquer usuário', async () => {
    // Seed (admin)
    // Cadastro + login + access e refresh Tokens + refreshUser (id)

    await request.post('/auth/register').send({
      userName: 'Admin',
      email: 'admin@gmail.com',
      confirmEmail: 'admin@gmail.com',
      tel: '(11) 99999-9999',
      password: 'senha789',
      confirmPassword: 'senha789',
    });

    await UserModel.findOneAndUpdate(
      { email: 'admin@gmail.com' },
      { role: 'admin' },
      {
        returnDocument: 'after', // substitui o 'new: true,' atualmente
        runValidators: true,
      },
    );

    const login = await request.post('/auth/login').send({
      email: 'admin@gmail.com',
      tel: '(11) 99999-9999',
      password: 'senha789',
    });

    const cookiesAdmin = login.headers['set-cookie'];

    // Teste
    const res = await request
      .get(`/users/${userId}/subscriptions/orders`)
      .set('Cookie', cookiesAdmin);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);

    expect(res.body[0].owner).toBe(userId);
  });
});
