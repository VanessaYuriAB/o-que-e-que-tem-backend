import mongoose from 'mongoose';
import Subscription from '../../src/modules/subscriptions/subscription.model.js';

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

  // -----------------
  // Custom Validator
  // -----------------

  // 4
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
        schedules: expect.any(Object),
      },
    });
  });

  // -----
  // Enum
  // -----

  // 5
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

  // 6
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

  // 7
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

  // 8
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
});
