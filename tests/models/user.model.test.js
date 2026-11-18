import User from '../../src/modules/users/user.model.js';
import Subscription from '../../src/modules/subscriptions/subscription.model.js';
import bcrypt from 'bcryptjs';
import UnauthorizedError from '../../src/shared/errors/UnauthorizedError.js';
import errorsMessages from '../../src/shared/utils/errorsMessages.js';

// Testes unitários de User

describe('User Model', () => {
  // -------
  // Válido
  // -------

  // 1
  it('deve validar um usuário válido', async () => {
    const user = new User({
      userName: 'Vanessa Yuri A. Brito',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
    });

    await expect(user.validate()).resolves.toBeUndefined();
  });

  // ---------
  // Required
  // ---------

  // 2
  it('deve exigir userName', async () => {
    const user = new User({
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        userName: expect.any(Object),
      },
    });
  });

  // 3
  it('deve exigir email', async () => {
    const user = new User({
      userName: 'Vanessa',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        email: expect.any(Object),
      },
    });
  });

  // 4
  it('deve exigir tel', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      password: 'abc12345',
      role: 'user',
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        tel: expect.any(Object),
      },
    });
  });

  // 5
  it('deve exigir password', async () => {
    const user = new User({
      userName: 'Vanessa',
      tel: '(11) 99999-9999',
      email: 'vanessa@email.com',
      role: 'user',
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        password: expect.any(Object),
      },
    });
  });

  // ------
  // Regex
  // ------

  // 6
  it('deve rejeitar userName com HTML', async () => {
    const user = new User({
      userName: '<script>alert(1)</script>',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        userName: expect.any(Object),
      },
    });
  });

  // 7
  it('deve rejeitar telefone inválido', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '11999999999',
      password: 'abc12345',
      role: 'user',
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        tel: expect.any(Object),
      },
    });
  });

  // 8
  it('deve rejeitar CEP inválido', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
      cep: '12345678',
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        cep: expect.any(Object),
      },
    });
  });

  // ----------
  // MinLength
  // ----------

  // 9
  it('deve rejeitar userName menor que 2 caracteres', async () => {
    const user = new User({
      userName: 'V',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        userName: expect.any(Object),
      },
    });
  });

  // ----------
  // MaxLength
  // ----------

  // 10
  it('deve rejeitar userName maior que 40 caracteres', async () => {
    const user = new User({
      userName: 'V'.repeat(41),
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        userName: expect.any(Object),
      },
    });
  });

  // -----------------
  // Custom Validator
  // -----------------

  // 11
  it('deve rejeitar email inválido', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        email: expect.any(Object),
      },
    });
  });

  // -----
  // Enum
  // -----

  // 12
  it('deve falhar com role inválido', async () => {
    const user = new User({
      userName: 'Vanessa Yuri A. Brito',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'manager',
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        role: expect.any(Object),
      },
    });
  });

  // 13
  it('deve aceitar role admin', async () => {
    const user = new User({
      userName: 'Admin',
      email: 'admin@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'admin',
    });

    await expect(user.validate()).resolves.toBeUndefined();
  });

  // --------
  // Default
  // --------

  // 14
  it('deve definir role como user por padrão', () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
    });

    expect(user.role).toBe('user');
  });

  // 15
  it('deve definir subscription como false por padrão', () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
    });

    expect(user.subscription).toBe(false);
  });

  // --------------
  // Campos vazios
  // --------------

  // 16
  it('Permite address vazio', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
      address: '',
    });

    expect(user.address).toBe('');
  });

  // 17
  it('Permite number vazio', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
      number: '',
    });

    expect(user.number).toBe('');
  });

  // 18
  it('Permite complement vazio', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
      complement: '',
    });

    expect(user.complement).toBe('');
  });

  // 19
  it('Permite district vazio', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
      district: '',
    });

    expect(user.district).toBe('');
  });

  // 20
  it('Permite cep vazio', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
      cep: '',
    });

    expect(user.cep).toBe('');
  });

  // 21
  it('Permite infoText vazio', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
      role: 'user',
      infoText: '',
    });

    expect(user.infoText).toBe('');
  });

  // --------------------------------------------
  // Middleware de documento (`pre('validate')`)
  // --------------------------------------------

  // 22
  it('obrigatoriedade condicional dos dados de endereço, para usuários com assinatura "delivery" e "status: true"', async () => {
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

    await expect(user.validate()).rejects.toMatchObject({
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

  // 23
  it('permissão condicional para validação sem dados de endereço, para usuários com assinatura "delivery" e "status: false"', async () => {
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

      status: false,
    });

    await subscription.save();

    user.subscription = true;
    user.subscriptionDetails = subscription._id;

    await expect(user.validate()).resolves.toBeUndefined();
  });

  // 24
  it('permissão condicional dos dados de endereço vazios, para usuários com assinatura "delivery" e "status: false"', async () => {
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

      status: false,
    });

    await subscription.save();

    user.address = '';
    user.number = '';
    user.complement = '';
    user.district = '';
    user.cep = '';

    user.subscription = true;
    user.subscriptionDetails = subscription._id;

    await expect(user.validate()).resolves.toBeUndefined();
  });

  // ----------------------------------------
  // findUserByCredentials (método estático)
  // ----------------------------------------

  // 25
  it('Deve autenticar usuário com credenciais válidas', async () => {
    const hash = await bcrypt.hash('abc12345', 10);

    await User.create({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: hash,
      role: 'user',
    });

    const user = await User.findUserByCredentials(
      'vanessa@email.com',
      'abc12345',
    );

    expect(user.email).toBe('vanessa@email.com');
  });

  // 26
  it('Deve rejeitar e-mail inexistente', async () => {
    await expect(
      User.findUserByCredentials('naoexiste@email.com', 'abc12345'),
    ).rejects.toThrow(UnauthorizedError);
  });

  // 27
  it('Deve rejeitar senha incorreta', async () => {
    const hash = await bcrypt.hash('abc12345', 10);

    await User.create({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: hash,
      role: 'user',
    });

    await expect(
      User.findUserByCredentials('vanessa@email.com', 'senhaErrada'),
    ).rejects.toThrow(UnauthorizedError);
  });

  // 28
  it('Garante proteção contra enumeração, tanto "e-mail inexistente" quanto "senha incorreta" retornam exatamente a mesma resposta', async () => {
    const hash = await bcrypt.hash('abc12345', 10);

    await User.create({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: hash,
      role: 'user',
    });

    await expect(
      User.findUserByCredentials('naoexiste@email.com', 'abc12345'),
    ).rejects.toThrow(`${errorsMessages.unauthorized} Login não autenticado.`);

    await expect(
      User.findUserByCredentials('vanessa@email.com', 'senhaErrada'),
    ).rejects.toThrow(`${errorsMessages.unauthorized} Login não autenticado.`);
  });
});
