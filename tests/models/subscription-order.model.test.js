import mongoose from 'mongoose';
import SubscriptionOrder from '../../src/modules/subscriptions/subscription-order.model.js';

describe('SubscriptionOrder Model', () => {
  const validSubscriptionOrder = {
    owner: new mongoose.Types.ObjectId(),

    orderNumber: 'S202608052114',

    meal: 'pate',
    method: 'delivery',
    day: new Date(), // formato do frontend '18/10/2026'
    time: '10:50',

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
  };

  // -------
  // Válido
  // -------

  // 1
  it('deve validar um pedido de assinatura válido', async () => {
    const subscriptionOrder = new SubscriptionOrder(validSubscriptionOrder);

    await expect(subscriptionOrder.validate()).resolves.toBeUndefined();
  });

  // ---------
  // Required
  // ---------

  // 2
  it('deve falhar sem owner', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      owner: undefined,
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 3
  it('deve falhar sem orderNumber', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      orderNumber: undefined,
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 4
  it('deve falhar sem day', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      day: undefined,
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 5
  it('deve falhar sem time', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      time: undefined,
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 6
  it('deve falhar sem itemsSnapshot._id', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      itemsSnapshot: [
        {
          productName: 'Abóbora',
          category: 'verduras-legumes',
          partnerName: 'Mercado 1',
        },
      ],
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 7
  it('deve falhar sem itemsSnapshot.productName', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      itemsSnapshot: [
        {
          _id: new mongoose.Types.ObjectId(),
          category: 'verduras-legumes',
          partnerName: 'Mercado 1',
        },
      ],
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 8
  it('deve falhar sem itemsSnapshot.category', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      itemsSnapshot: [
        {
          _id: new mongoose.Types.ObjectId(),
          productName: 'Abóbora',
          partnerName: 'Mercado 1',
        },
      ],
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 9
  it('deve falhar sem itemsSnapshot.partnerName', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      itemsSnapshot: [
        {
          _id: new mongoose.Types.ObjectId(),
          productName: 'Abóbora',
          category: 'verduras-legumes',
        },
      ],
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 10
  it('deve exigir addressSnapshot quando method for delivery', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      method: 'delivery',
      addressSnapshot: {},
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 11
  it('não deve exigir addressSnapshot quando method for drive-thru', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      method: 'drive-thru',
      addressSnapshot: undefined,
    });

    await expect(subscriptionOrder.validate()).resolves.toBeUndefined();
  });

  // -----
  // Enum
  // -----

  // 12
  it('deve falhar com meal inválido', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      meal: 'pizza',
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 13
  it('deve falhar com method inválido', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      method: 'retirada',
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 14
  it('deve falhar com itemsSnapshot.category inválida', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      itemsSnapshot: [
        {
          _id: new mongoose.Types.ObjectId(),
          productName: 'Abóbora',
          category: 'frutas',
          partnerName: 'Mercado 1',
        },
      ],
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // ----------------------
  // Validação customizada
  // ----------------------

  // 15
  it('deve falhar com email inválido', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      customerSnapshot: {
        ...validSubscriptionOrder.customerSnapshot,
        email: 'email-invalido',
      },
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 16
  it('deve falhar sem itens', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      itemsSnapshot: [],
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // ------
  // Match
  // ------

  // 17
  it('deve falhar com time inválido', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      time: '10h50',
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 18
  it('deve falhar com orderNumber inválido', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      orderNumber: '202608052114',
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 19
  it('deve falhar com time antes das 10h45', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      time: '10:44',
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // 20
  it('deve falhar com time depois das 19h45', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      time: '19:46',
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });

  // -----
  // Type
  // -----

  // 21
  it('deve falhar com day inválido', async () => {
    const subscriptionOrder = new SubscriptionOrder({
      ...validSubscriptionOrder,
      day: '18/10/2026',
    });

    await expect(subscriptionOrder.validate()).rejects.toThrow();
  });
});
