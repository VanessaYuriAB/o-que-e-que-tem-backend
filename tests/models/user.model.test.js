import User from '../../src/modules/users/user.model.js';

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
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        tel: expect.any(Object),
      },
    });
  });

  // 8
  it('deve rejeitar senha sem número', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abcdefgh',
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        password: expect.any(Object),
      },
    });
  });

  // 9
  it('deve rejeitar CEP inválido', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
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

  // 10
  it('deve rejeitar userName menor que 2 caracteres', async () => {
    const user = new User({
      userName: 'V',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
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

  // 11
  it('deve rejeitar userName maior que 40 caracteres', async () => {
    const user = new User({
      userName: 'V'.repeat(41),
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
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

  // 12
  it('deve rejeitar email inválido', async () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email',
      tel: '(11) 99999-9999',
      password: 'abc12345',
    });

    await expect(user.validate()).rejects.toMatchObject({
      errors: {
        email: expect.any(Object),
      },
    });
  });

  // --------
  // Default
  // --------

  // 13
  it('deve definir subscription como false por padrão', () => {
    const user = new User({
      userName: 'Vanessa',
      email: 'vanessa@email.com',
      tel: '(11) 99999-9999',
      password: 'abc12345',
    });

    expect(user.subscription).toBe(false);
  });
});
