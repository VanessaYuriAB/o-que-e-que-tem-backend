// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import UserModel from '../../../src/modules/users/user.model.js';
import OrderModel from '../../../src/modules/orders/order.model.js';
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de cadastro de pedido avulso
// requisição HTTP > validateContentType > celebrateForCreateOrder > createOrder > DB

describe('Create Order Flow > POST "/orders"', () => {
  // --------
  // Payload
  // --------

  const orderPayload = {
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
  };

  // --------
  // Válidos
  // --------

  // 1
  it('Cadastro com sucesso + persistência (usuário já cadastrado)', async () => {
    // Seed (register)
    const register = await request.post('/auth/register').send({
      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      confirmEmail: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      password: 'senha123',
      confirmPassword: 'senha123',
    });

    expect(register.statusCode).toBe(201);

    // Teste
    const res = await request.post('/orders').send(orderPayload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    expect(res.body.owner).toBeDefined();
    expect(res.body.owner).toMatch(/^[0-9a-fA-F]{24}$/);

    expect(res.body).toMatchObject(
      expect.objectContaining({
        meal: orderPayload.meal,
        method: orderPayload.method,
        payment: orderPayload.payment,

        customerSnapshot: expect.objectContaining({
          userName: orderPayload.customerSnapshot.userName,
          email: orderPayload.customerSnapshot.email,
          tel: orderPayload.customerSnapshot.tel,
        }),

        addressSnapshot: expect.objectContaining({
          address: orderPayload.addressSnapshot.address,
          number: orderPayload.addressSnapshot.number,
          complement: orderPayload.addressSnapshot.complement,
          district: orderPayload.addressSnapshot.district,
          cep: orderPayload.addressSnapshot.cep,
        }),

        itemsSnapshot: expect.arrayContaining([
          {
            _id: orderPayload.itemsSnapshot[0]._id,
            productName: orderPayload.itemsSnapshot[0].productName,
            category: orderPayload.itemsSnapshot[0].category,
            partnerName: orderPayload.itemsSnapshot[0].partnerName,
          },
          {
            _id: orderPayload.itemsSnapshot[1]._id,
            productName: orderPayload.itemsSnapshot[1].productName,
            category: orderPayload.itemsSnapshot[1].category,
            partnerName: orderPayload.itemsSnapshot[1].partnerName,
          },
        ]),

        obs: orderPayload.obs,
      }),
    );

    // Persistência
    const user = await UserModel.findOne({
      email: orderPayload.customerSnapshot.email,
    });

    expect(user).not.toBeNull();
    expect(user.email).toBe(orderPayload.customerSnapshot.email);

    const order = await OrderModel.findOne({
      owner: user._id,
    });

    expect(order).not.toBeNull();
    expect(order.owner.toString()).toBe(user._id.toString());

    expect(order.customerSnapshot.email).toBe(
      orderPayload.customerSnapshot.email,
    );

    expect(order._id.toString()).toMatch(/^[0-9a-fA-F]{24}$/); // formato de ObjectId do Mongo DB
    expect(order.orderNumber).toEqual(expect.any(String));
    expect(order.orderNumber).toHaveLength(12);
    expect(order.orderNumber).toMatch(/^\d{12}$/);
    expect(order.amount).toBe(35);
  });

  // 2
  it('Cadastro com sucesso + persistência (usuário não cadastrado)', async () => {
    // Teste
    const res = await request.post('/orders').send(orderPayload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    expect(res.body.owner).toBeNull();

    expect(res.body).toMatchObject(
      expect.objectContaining({
        meal: orderPayload.meal,
        method: orderPayload.method,
        payment: orderPayload.payment,

        customerSnapshot: expect.objectContaining({
          userName: orderPayload.customerSnapshot.userName,
          email: orderPayload.customerSnapshot.email,
          tel: orderPayload.customerSnapshot.tel,
        }),

        addressSnapshot: expect.objectContaining({
          address: orderPayload.addressSnapshot.address,
          number: orderPayload.addressSnapshot.number,
          complement: orderPayload.addressSnapshot.complement,
          district: orderPayload.addressSnapshot.district,
          cep: orderPayload.addressSnapshot.cep,
        }),

        itemsSnapshot: expect.arrayContaining([
          {
            _id: orderPayload.itemsSnapshot[0]._id,
            productName: orderPayload.itemsSnapshot[0].productName,
            category: orderPayload.itemsSnapshot[0].category,
            partnerName: orderPayload.itemsSnapshot[0].partnerName,
          },
          {
            _id: orderPayload.itemsSnapshot[1]._id,
            productName: orderPayload.itemsSnapshot[1].productName,
            category: orderPayload.itemsSnapshot[1].category,
            partnerName: orderPayload.itemsSnapshot[1].partnerName,
          },
        ]),

        obs: orderPayload.obs,
      }),
    );

    // Persistência
    const user = await UserModel.findOne({
      email: orderPayload.customerSnapshot.email,
    });

    expect(user).toBeNull();

    const order = await OrderModel.findOne({
      'customerSnapshot.email': orderPayload.customerSnapshot.email,
    });

    expect(order).not.toBeNull();
    expect(order.owner).toBeNull();

    expect(order.customerSnapshot.email).toBe(
      orderPayload.customerSnapshot.email,
    );

    expect(order._id.toString()).toMatch(/^[0-9a-fA-F]{24}$/); // formato de ObjectId do Mongo DB
    expect(order.orderNumber).toEqual(expect.any(String));
    expect(order.orderNumber).toHaveLength(12);
    expect(order.orderNumber).toMatch(/^\d{12}$/);
    expect(order.amount).toBe(35);
  });

  // --------------------
  // validateContentType
  // --------------------

  // 3
  it('Content-Type inválido', async () => {
    const error = await request
      .post('/orders')
      .set('Content-Type', 'text/plain')
      .send('teste de header content-type');

    // pq com '.send(orderPayload)', o Supertest envia JSON automaticamente, adicionando 'Content-Type: application/json' implicitamente

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(415);

    expect(error.body.message).toBe(
      `${errorsMessages.unsupportedMediaType} Content-Type deve ser application/json.`,
    );
  });

  // -----------------------------------
  // celebrateForCreateOrder (required)
  // -----------------------------------

  // 4
  it('Exige meal', async () => {
    const payload = { ...orderPayload };
    delete payload.meal;

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 5
  it('Exige method', async () => {
    const payload = { ...orderPayload };
    delete payload.method;

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 6
  it('Exige payment', async () => {
    const payload = { ...orderPayload };
    delete payload.payment;

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 7
  it('Exige customerSnapshot ({userName, email, tel})', async () => {
    const payload = { ...orderPayload };
    delete payload.customerSnapshot;

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 8
  it('Exige itemsSnapshot ([{_id, productName, category, partnerName}])', async () => {
    const payload = { ...orderPayload };
    delete payload.itemsSnapshot;

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------------------------------------
  // celebrateForCreateOrder (when/is/then + required)
  // --------------------------------------------------

  // 9
  it('delivery exige addressSnapshot ({address, number, complement, district, cep})', async () => {
    const payload = { ...orderPayload };
    delete payload.addressSnapshot;

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 10
  it('Aceita drive-thru com addressSnapshot ({address, number, complement, district, cep})', async () => {
    const payload = { ...orderPayload, method: 'drive-thru' };

    const res = await request.post('/orders').send(payload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);
  });

  // 11
  it('Aceita drive-thru sem addressSnapshot ({address, number, complement, district, cep})', async () => {
    const payload = { ...orderPayload, method: 'drive-thru' };
    delete payload.addressSnapshot;

    const res = await request.post('/orders').send(payload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);
  });

  // --------------------------------
  // celebrateForCreateOrder (valid)
  // --------------------------------

  // 12
  it('Rejeita meal inválido', async () => {
    const payload = { ...orderPayload, meal: 'risoto' };

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 13
  it('Rejeita method inválido', async () => {
    const payload = { ...orderPayload, method: 'motoboy' };

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 14
  it('Rejeita payment inválido', async () => {
    const payload = { ...orderPayload, payment: 'dinheiro' };

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 15
  it('Rejeita itemsSnapshot.category inválido', async () => {
    const payload = {
      ...orderPayload,
      itemsSnapshot: [
        {
          ...orderPayload.itemsSnapshot[0],
          category: 'tempero',
        },
      ],
    };

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ----------------------------------
  // celebrateForCreateOrder (pattern)
  // ----------------------------------

  // 16
  it('Rejeita customerSnapshot.userName com formato inválido, contendo HTML básico (< e >)', async () => {
    const payload = {
      ...orderPayload,
      customerSnapshot: {
        ...orderPayload.customerSnapshot,
        userName: '<Vanessa Yuri A. Brito>',
      },
    };

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 17
  it('Rejeita tel com formato inválido, regex para (XX) XXXXX-XXXX', async () => {
    const payload = {
      ...orderPayload,
      customerSnapshot: {
        ...orderPayload.customerSnapshot,
        tel: '11 989502164',
      },
    };

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 18
  it('Rejeita addressSnapshot.address com formato inválido, contendo HTML básico (< e >)', async () => {
    const payload = {
      ...orderPayload,
      addressSnapshot: {
        ...orderPayload.addressSnapshot,
        address: '<Rua tal>',
      },
    };

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 19
  it('Rejeita addressSnapshot.number com formato inválido, são aceitos: letras, números e espaços em branco', async () => {
    const payload = {
      ...orderPayload,
      addressSnapshot: {
        ...orderPayload.addressSnapshot,
        number: '20 Á',
      },
    };

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 20
  it('Rejeita addressSnapshot.complement com formato inválido, são aceitos: letras, números, espaços em branco, pontos finais e traços', async () => {
    const payload = {
      ...orderPayload,
      addressSnapshot: {
        ...orderPayload.addressSnapshot,
        complement: '@pto 40',
      },
    };

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 21
  it('Rejeita addressSnapshot.district com formato inválido, são aceitos: letras, acentos, números e espaços em branco', async () => {
    const payload = {
      ...orderPayload,
      addressSnapshot: {
        ...orderPayload.addressSnapshot,
        district: 'Bairro tal.',
      },
    };

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 22
  it('Rejeita addressSnapshot.cep com formato inválido, regex para XXXXX-XXX', async () => {
    const payload = {
      ...orderPayload,
      addressSnapshot: {
        ...orderPayload.addressSnapshot,
        cep: '12345678',
      },
    };

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 23
  it('Rejeita obs com formato inválido, contendo HTML básico (< e >)', async () => {
    const payload = {
      ...orderPayload,
      obs: '<Próximo à estação de metrô.>',
    };

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------------------
  // celebrateForCreateOrder (email)
  // --------------------------------

  // 24
  it('Rejeita email inválido', async () => {
    const payload = {
      ...orderPayload,
      customerSnapshot: {
        ...orderPayload.customerSnapshot,
        email: 'email-invalido',
      },
    };

    const error = await request.post('/orders').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });
});
