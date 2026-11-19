// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de busca de pedido de assinatura
// requisição HTTP > celebrateForGetSubscriptionOrderByNumber > getSubscriptionOrderByNumber

describe('Get Subscription Order By Number Flow > GET "/subscriptions/orders/:subscriptionOrderNumber" > Query: ?email=user@email.com', () => {
  // -------------------------------------------------------------------------------
  // Seed
  // Register + login + accessToken + createSubscription (drive-thru) + cadastro de
  // pedido de assinatura
  // -------------------------------------------------------------------------------

  // O teste é realizado com uma assinatura drive-thru, sem a necessidade de atualização de cadastro de usuário para informações de endereço, apenas para validar o funcionamento da busca do endpoint em si

  let cookies;
  let subscriptionOrderSeed;

  beforeEach(async () => {
    // Cadastro de usuário
    await request.post('/auth/register').send({
      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      confirmEmail: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      password: 'senha123',
      confirmPassword: 'senha123',
    });

    // Login
    const login = await request.post('/auth/login').send({
      email: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      password: 'senha123',
    });

    // accessToken
    cookies = login.headers['set-cookie'];

    // Cadastro de assinatura (drive-thru)
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

    // Cadastro de pedido de assinatura
    const subscriptionOrder = await request
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

    subscriptionOrderSeed = subscriptionOrder.body;
  });

  // -------
  // Válido
  // -------

  // 1
  it('Deve retornar o pedido solicitado', async () => {
    const res = await request.get(
      `/subscriptions/orders/${subscriptionOrderSeed.orderNumber}?email=${subscriptionOrderSeed.customerSnapshot.email}`,
    );

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(res.body.orderNumber).toBe(subscriptionOrderSeed.orderNumber);
    expect(res.body.customerSnapshot.email).toBe(
      subscriptionOrderSeed.customerSnapshot.email,
    );

    expect(res.body).toMatchObject(subscriptionOrderSeed);
  });

  // ---------------
  // NotFound (404)
  // ---------------

  // 2
  it('Deve retornar 404 (orderNumber não localizado)', async () => {
    const invalidOrderNumber = `S${'9'.repeat(12)}`;

    const error = await request.get(
      `/subscriptions/orders/${invalidOrderNumber}?email=${subscriptionOrderSeed.customerSnapshot.email}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(404);

    expect(error.body.message).toBe(
      `${errorsMessages.notFound} Erro ao buscar pedido de assinatura: pedido ${invalidOrderNumber} não encontrado.`,
    );
  });

  // 3
  it('Deve retornar 404 (email não localizado)', async () => {
    const invalidEmail = 'user@email.com';

    const error = await request.get(
      `/subscriptions/orders/${subscriptionOrderSeed.orderNumber}?email=${invalidEmail}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(404);

    expect(error.body.message).toBe(
      `${errorsMessages.notFound} Erro ao buscar pedido de assinatura: pedido ${subscriptionOrderSeed.orderNumber} não encontrado.`,
    );
  });

  // ----------------------------------------------------
  // celebrateForGetSubscriptionOrderByNumber (required)
  // ----------------------------------------------------

  // 4
  it('Exige email (query)', async () => {
    const error = await request.get(
      `/subscriptions/orders/${subscriptionOrderSeed.orderNumber}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------------------------------------
  // celebrateForGetSubscriptionOrderByNumber (params)
  // --------------------------------------------------

  // 5
  it('Bloqueia orderNumber com menos de 12 dígitos após o prefixo "S"', async () => {
    const invalidOrderNumber = subscriptionOrderSeed.orderNumber.slice(0, -1);

    const error = await request.get(
      `/subscriptions/orders/${invalidOrderNumber}?email=${subscriptionOrderSeed.customerSnapshot.email}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 6
  it('Bloqueia orderNumber sem o caractere "S" inicial', async () => {
    const invalidOrderNumber = '9'.repeat(13);

    const error = await request.get(
      `/subscriptions/orders/${invalidOrderNumber}?email=${subscriptionOrderSeed.customerSnapshot.email}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 7
  it('Bloqueia orderNumber com caracteres não numéricos', async () => {
    const invalidOrderNumber = `S${'9'.repeat(11)}S`;

    const error = await request.get(
      `/subscriptions/orders/${invalidOrderNumber}?email=${subscriptionOrderSeed.customerSnapshot.email}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -------------------------------------------------
  // celebrateForGetSubscriptionOrderByNumber (query)
  // -------------------------------------------------

  // 8
  it('Bloqueia email em formato inválido', async () => {
    const invalidEmail = 'email-invalido';

    const error = await request.get(
      `/subscriptions/orders/${subscriptionOrderSeed.orderNumber}?email=${invalidEmail}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 9
  it('Bloqueia campos desconhecidos pelo validador do endpoint', async () => {
    const unknownQuery = '400';

    const error = await request.get(
      `/subscriptions/orders/${subscriptionOrderSeed.orderNumber}?email=${subscriptionOrderSeed.customerSnapshot.email}&unknown=${unknownQuery}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });
});
