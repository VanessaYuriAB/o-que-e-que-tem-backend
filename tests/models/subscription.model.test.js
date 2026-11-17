import mongoose from 'mongoose';
import Subscription from '../../src/modules/subscriptions/subscription.model.js';
import User from '../../src/modules/users/user.model.js';

// Testes unitários de Subscription

describe('Subscription Model', () => {
  // -------
  // Válido
  // -------

  // 1
  it('deve validar uma assinatura válida', async () => {
    const subscription = new Subscription({
      owner: new mongoose.Types.ObjectId(),
      howLong: 'two',
      daysOn: ['seg', 'qua'],
      schedules: {
        seg: '18:50',
        qua: '19:20',
      },
      method: 'delivery',
      pay: 'pix',
    });

    await expect(subscription.validate()).resolves.toBeUndefined();
  });

  // ---------
  // Required
  // ---------

  // 2
  it('deve exigir owner', async () => {
    const subscription = new Subscription({
      howLong: 'two',
      daysOn: ['seg'],
      schedules: {
        seg: '18:50',
      },
      method: 'drive-thru',
      pay: 'pix',
    });

    await expect(subscription.validate()).rejects.toMatchObject({
      errors: {
        owner: expect.any(Object),
      },
    });
  });

  // 3
  it('deve exigir pay', async () => {
    const subscription = new Subscription({
      owner: new mongoose.Types.ObjectId(),
      howLong: 'two',
      daysOn: ['seg'],
      schedules: {
        seg: '18:50',
      },
      method: 'drive-thru',
    });

    await expect(subscription.validate()).rejects.toMatchObject({
      errors: {
        pay: expect.any(Object),
      },
    });
  });

  // -----
  // Enum
  // -----

  // 4
  it('deve rejeitar howLong inválido', async () => {
    const subscription = new Subscription({
      owner: new mongoose.Types.ObjectId(),
      howLong: 'three',
      daysOn: ['seg'],
      schedules: {
        seg: '18:50',
      },
      method: 'drive-thru',
      pay: 'pix',
    });

    await expect(subscription.validate()).rejects.toMatchObject({
      errors: {
        howLong: expect.any(Object),
      },
    });
  });

  // 5
  it('deve rejeitar daysOn inválido', async () => {
    const subscription = new Subscription({
      owner: new mongoose.Types.ObjectId(),
      howLong: 'two',
      daysOn: ['sab'],
      schedules: {
        sab: '18:50',
      },
      method: 'drive-thru',
      pay: 'pix',
    });

    await expect(subscription.validate()).rejects.toMatchObject({
      errors: {
        'daysOn.0': expect.any(Object),
      },
    });
  });

  // 6
  it('deve rejeitar method inválido', async () => {
    const subscription = new Subscription({
      owner: new mongoose.Types.ObjectId(),
      howLong: 'two',
      daysOn: ['seg'],
      schedules: {
        seg: '18:50',
      },
      method: 'pickup',
      pay: 'pix',
    });

    await expect(subscription.validate()).rejects.toMatchObject({
      errors: {
        method: expect.any(Object),
      },
    });
  });

  // 7
  it('deve rejeitar pay inválido', async () => {
    const subscription = new Subscription({
      owner: new mongoose.Types.ObjectId(),
      howLong: 'two',
      daysOn: ['seg'],
      schedules: {
        seg: '18:50',
      },
      method: 'drive-thru',
      pay: 'boleto',
    });

    await expect(subscription.validate()).rejects.toMatchObject({
      errors: {
        pay: expect.any(Object),
      },
    });
  });

  // ---------------------------------------------
  // Middlewares de documento (`pre('validate')`)
  // ---------------------------------------------

  // 8
  it('daysOn e schedules devem ser consistentes', async () => {
    const subscription = new Subscription({
      owner: new mongoose.Types.ObjectId(),
      howLong: 'two',
      daysOn: ['seg', 'qua'],
      schedules: {
        seg: '18:50',
      },
      method: 'drive-thru',
      pay: 'pix',
    });

    await expect(subscription.validate()).rejects.toMatchObject({
      errors: {
        schedules: expect.objectContaining({
          message:
            'Os dias selecionados e os horários informados devem corresponder exatamente.',
        }),
      },
    });
  });

  // 9
  it('cálculo automático da data de término da assinatura ("endAt")', async () => {
    const subscription = new Subscription({
      owner: new mongoose.Types.ObjectId(),
      howLong: 'two',
      daysOn: ['seg', 'qua'],
      schedules: {
        seg: '18:50',
        qua: '19:20',
      },
      method: 'drive-thru',
      pay: 'debito',
    });

    await subscription.validate();

    expect(subscription.endAt).toBeDefined();

    expect(Date.parse(subscription.endAt)).not.toBeNaN();

    expect(new Date(subscription.endAt).toString()).not.toBe('Invalid Date');
  });

  // 10
  it('validação da obrigatoriedade de endereço para assinaturas "delivery"', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
    });

    const subscription = new Subscription({
      owner: user._id,
      howLong: 'two',
      daysOn: ['seg', 'qua'],
      schedules: {
        seg: '18:50',
        qua: '19:20',
      },
      method: 'delivery',
      pay: 'pix',
    });

    await subscription.save();

    user.subscription = true;
    user.subscriptionDetails = subscription._id;

    await user.populate('subscriptionDetails');

    await expect(user.save()).rejects.toMatchObject({
      errors: {
        address: expect.objectContaining({
          message:
            'Campo de endereço obrigatório para assinantes com entrega delivery.',
        }),

        number: expect.any(Object),
        complement: expect.any(Object),
        district: expect.any(Object),
        cep: expect.any(Object),
      },
    });
  });
});
