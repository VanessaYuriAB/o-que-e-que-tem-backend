// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de busca de pedido avulso
// requisição HTTP > celebrateForGetOrderByNumber > getOrderByNumber

describe('Get Order By Number Flow > GET "/orders/:orderNumber" > Query: ?email=user@email.com', () => {
  // ---------------------------------
  // Seed (cadastro de pedido avulso)
  // ---------------------------------

  let orderSeed;

  beforeEach(async () => {
    const order = await request.post('/orders').send({
      meal: 'sopa',
      method: 'delivery',
      payment: 'credito',

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
    });

    orderSeed = order.body;
  });

  // -------
  // Válido
  // -------

  // 1
  it('Deve retornar o pedido solicitado', async () => {
    const res = await request.get(
      `/orders/${orderSeed.orderNumber}?email=${orderSeed.customerSnapshot.email}`,
    );

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(res.body.orderNumber).toBe(orderSeed.orderNumber);
    expect(res.body.customerSnapshot.email).toBe(
      orderSeed.customerSnapshot.email,
    );

    expect(res.body).toMatchObject(orderSeed);
  });

  // ---------------
  // NotFound (404)
  // ---------------

  // 2
  it('Deve retornar 404 (orderNumber não localizado)', async () => {
    const invalidOrderNumber = '9'.repeat(12);

    const error = await request.get(
      `/orders/${invalidOrderNumber}?email=${orderSeed.customerSnapshot.email}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(404);

    expect(error.body.message).toBe(
      `${errorsMessages.notFound} Erro ao buscar pedido avulso: pedido ${invalidOrderNumber} não encontrado.`,
    );
  });

  // 3
  it('Deve retornar 404 (email não localizado)', async () => {
    const invalidEmail = 'user@email.com';

    const error = await request.get(
      `/orders/${orderSeed.orderNumber}?email=${invalidEmail}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(404);

    expect(error.body.message).toBe(
      `${errorsMessages.notFound} Erro ao buscar pedido avulso: pedido ${orderSeed.orderNumber} não encontrado.`,
    );
  });

  // ----------------------------------------
  // celebrateForGetOrderByNumber (required)
  // ----------------------------------------

  // 4
  it('Exige email (query)', async () => {
    const error = await request.get(`/orders/${orderSeed.orderNumber}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------------------------
  // celebrateForGetOrderByNumber (params)
  // --------------------------------------

  // 5
  it('Bloqueia orderNumber com menos de 12 dígitos', async () => {
    const invalidOrderNumber = orderSeed.orderNumber.slice(0, -1);

    const error = await request.get(
      `/orders/${invalidOrderNumber}?email=${orderSeed.customerSnapshot.email}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 6
  it('Bloqueia orderNumber com caracteres não numéricos', async () => {
    const invalidOrderNumber = `S${orderSeed.orderNumber.slice(1)}`;

    const error = await request.get(
      `/orders/${invalidOrderNumber}?email=${orderSeed.customerSnapshot.email}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -------------------------------------
  // celebrateForGetOrderByNumber (query)
  // -------------------------------------

  // 7
  it('Bloqueia email em formato inválido', async () => {
    const invalidEmail = 'email-invalido';

    const error = await request.get(
      `/orders/${orderSeed.orderNumber}?email=${invalidEmail}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 8
  it('Bloqueia campos desconhecidos pelo validador do endpoint', async () => {
    const unknownQuery = '400';

    const error = await request.get(
      `/orders/${orderSeed.orderNumber}?email=${orderSeed.customerSnapshot.email}&unknown=${unknownQuery}`,
    );

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });
});
