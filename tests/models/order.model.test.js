import mongoose from 'mongoose';
import Order from '../../src/modules/orders/order.model.js';

describe('Order Model', () => {
  const validOrder = {
    owner: new mongoose.Types.ObjectId(),

    orderNumber: '202608052114',

    meal: 'pate',
    method: 'delivery',
    payment: 'credito',
    amount: 45,

    customerSnapshot: {
      userName: 'João Silva',
      email: 'joao@email.com',
      tel: '(11) 99999-9999',
    },

    addressSnapshot: {
      address: 'Rua A',
      number: '123',
      complement: 'Ap 10',
      district: 'Centro',
      cep: '12345-678',
    },

    itemsSnapshot: [
      {
        _id: new mongoose.Types.ObjectId(),
        productName: 'Abóbora',
        category: 'verduras-legumes',
        partnerName: 'Mercado 1',
      },
    ],

    obs: 'Observação teste',
  };

  // --------
  // Válidos
  // --------

  // 1
  it('deve validar um pedido válido (completo)', async () => {
    const order = new Order(validOrder);

    await expect(order.validate()).resolves.toBeUndefined();
  });

  // 2
  it('deve validar um pedido válido (com campo "addressSnapshot.complement" vazio)', async () => {
    const order = new Order({
      ...validOrder,
      addressSnapshot: {
        ...validOrder.addressSnapshot,
        complement: '',
      },
    });

    await expect(order.validate()).resolves.toBeUndefined();
  });

  // 3
  it('deve validar um pedido válido (com campo "obs" vazio)', async () => {
    const order = new Order({ ...validOrder, obs: '' });

    await expect(order.validate()).resolves.toBeUndefined();
  });

  // 4
  it('deve validar um pedido com owner null', async () => {
    const order = new Order({
      ...validOrder,
      owner: null,
    });

    await expect(order.validate()).resolves.toBeUndefined();
  });

  // ---------
  // Required
  // ---------

  // 5
  it('deve falhar sem orderNumber', async () => {
    const order = new Order({
      ...validOrder,
      orderNumber: undefined,
    });

    await expect(order.validate()).rejects.toThrow();
  });

  // 6
  it('deve falhar sem itemsSnapshot._id', async () => {
    const order = new Order({
      ...validOrder,
      itemsSnapshot: [
        {
          productName: 'Abóbora',
          category: 'verduras-legumes',
          partnerName: 'Mercado 1',
        },
      ],
    });

    await expect(order.validate()).rejects.toThrow();
  });

  // 7
  it('deve falhar sem itemsSnapshot.productName', async () => {
    const order = new Order({
      ...validOrder,
      itemsSnapshot: [
        {
          _id: new mongoose.Types.ObjectId(),
          category: 'verduras-legumes',
          partnerName: 'Mercado 1',
        },
      ],
    });

    await expect(order.validate()).rejects.toThrow();
  });

  // 8
  it('deve falhar sem itemsSnapshot.category', async () => {
    const order = new Order({
      ...validOrder,
      itemsSnapshot: [
        {
          _id: new mongoose.Types.ObjectId(),
          productName: 'Abóbora',
          partnerName: 'Mercado 1',
        },
      ],
    });

    await expect(order.validate()).rejects.toThrow();
  });

  // 9
  it('deve falhar sem itemsSnapshot.partnerName', async () => {
    const order = new Order({
      ...validOrder,
      itemsSnapshot: [
        {
          _id: new mongoose.Types.ObjectId(),
          productName: 'Abóbora',
          category: 'verduras-legumes',
        },
      ],
    });

    await expect(order.validate()).rejects.toThrow();
  });

  // 10
  it('deve exigir addressSnapshot quando method for delivery', async () => {
    const order = new Order({
      ...validOrder,
      method: 'delivery',
      addressSnapshot: {},
    });

    await expect(order.validate()).rejects.toThrow();
  });

  // 11
  it('não deve exigir addressSnapshot quando method for drive-thru', async () => {
    const order = new Order({
      ...validOrder,
      method: 'drive-thru',
      addressSnapshot: undefined,
    });

    await expect(order.validate()).resolves.toBeUndefined();
  });

  // -----
  // Enum
  // -----

  // 12
  it('deve falhar com meal inválido', async () => {
    const order = new Order({
      ...validOrder,
      meal: 'pizza',
    });

    await expect(order.validate()).rejects.toThrow();
  });

  // 13
  it('deve falhar com method inválido', async () => {
    const order = new Order({
      ...validOrder,
      method: 'retirada',
    });

    await expect(order.validate()).rejects.toThrow();
  });

  // 14
  it('deve falhar com payment inválido', async () => {
    const order = new Order({
      ...validOrder,
      payment: 'boleto',
    });

    await expect(order.validate()).rejects.toThrow();
  });

  // 15
  it('deve falhar com itemsSnapshot.category inválida', async () => {
    const order = new Order({
      ...validOrder,
      itemsSnapshot: [
        {
          _id: new mongoose.Types.ObjectId(),
          productName: 'Abóbora',
          category: 'frutas',
          partnerName: 'Mercado 1',
        },
      ],
    });

    await expect(order.validate()).rejects.toThrow();
  });

  // ----------------------
  // Validação customizada
  // ----------------------

  // 16
  it('deve falhar com email inválido', async () => {
    const order = new Order({
      ...validOrder,
      customerSnapshot: {
        ...validOrder.customerSnapshot,
        email: 'email-invalido',
      },
    });

    await expect(order.validate()).rejects.toThrow();
  });

  // 17
  it('deve falhar sem itens', async () => {
    const order = new Order({
      ...validOrder,
      itemsSnapshot: [],
    });

    await expect(order.validate()).rejects.toThrow();
  });

  // ----
  // Min
  // ----

  // 18
  it('deve falhar com amount negativo', async () => {
    const order = new Order({
      ...validOrder,
      amount: -10,
    });

    await expect(order.validate()).rejects.toThrow();
  });

  // ------
  // Match
  // ------

  // 19
  it('deve falhar com orderNumber inválido', async () => {
    const order = new Order({
      ...validOrder,
      orderNumber: 'S202608052114',
    });

    await expect(order.validate()).rejects.toThrow();
  });
});
