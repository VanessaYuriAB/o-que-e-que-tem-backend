import Partner from '../../src/modules/partners/partner.model.js';

describe('Partner Model', () => {
  // -------
  // Válido
  // -------

  // 1
  it('deve criar uma inscrição de parceria válida', async () => {
    const partner = new Partner({
      userName: 'João Silva',
      email: 'joao@email.com',
      tel: '(11) 99999-9999',
      contactMethod: 'email',
      companyName: 'Mercado Exemplo',
      cnpj: '12345678000199',
      cep: '12345-678',
      address: 'Rua A',
      numberAddress: '123',
      complementAddress: 'Sala 1',
      district: 'Centro',
    });

    await expect(partner.validate()).resolves.toBeUndefined();
  });

  // ---------
  // Required
  // ---------

  // 2
  it('deve exigir userName', async () => {
    const partner = new Partner({
      email: 'joao@email.com',
      tel: '(11) 99999-9999',
      companyName: 'Mercado Exemplo',
      cnpj: '12345678000199',
      cep: '12345-678',
    });

    await expect(partner.validate()).rejects.toMatchObject({
      errors: {
        userName: expect.any(Object),
      },
    });
  });

  // 3
  it('deve exigir email', async () => {
    const partner = new Partner({
      userName: 'João Silva',
      tel: '(11) 99999-9999',
      companyName: 'Mercado Exemplo',
      cnpj: '12345678000199',
      cep: '12345-678',
    });

    await expect(partner.validate()).rejects.toMatchObject({
      errors: {
        email: expect.any(Object),
      },
    });
  });

  // 4
  it('deve exigir companyName', async () => {
    const partner = new Partner({
      userName: 'João Silva',
      email: 'joao@email.com',
      tel: '(11) 99999-9999',
      cnpj: '12345678000199',
      cep: '12345-678',
    });

    await expect(partner.validate()).rejects.toMatchObject({
      errors: {
        companyName: expect.any(Object),
      },
    });
  });

  // 5
  it('deve exigir cnpj', async () => {
    const partner = new Partner({
      userName: 'João Silva',
      email: 'joao@email.com',
      tel: '(11) 99999-9999',
      companyName: 'Mercado Exemplo',
      cep: '12345-678',
    });

    await expect(partner.validate()).rejects.toMatchObject({
      errors: {
        cnpj: expect.any(Object),
      },
    });
  });

  // ----------------------
  // Validação customizada
  // ----------------------

  // 6
  it('deve rejeitar email inválido', async () => {
    const partner = new Partner({
      userName: 'João Silva',
      email: 'email-invalido',
      tel: '(11) 99999-9999',
      companyName: 'Mercado Exemplo',
      cnpj: '12345678000199',
      cep: '12345-678',
    });

    await expect(partner.validate()).rejects.toMatchObject({
      errors: {
        email: expect.any(Object),
      },
    });
  });

  // -----
  // Enum
  // -----

  // 7
  it('deve rejeitar contactMethod inválido', async () => {
    const partner = new Partner({
      userName: 'João Silva',
      email: 'joao@email.com',
      tel: '(11) 99999-9999',
      contactMethod: 'whatsapp',
      companyName: 'Mercado Exemplo',
      cnpj: '12345678000199',
      cep: '12345-678',
    });

    await expect(partner.validate()).rejects.toMatchObject({
      errors: {
        contactMethod: expect.any(Object),
      },
    });
  });

  // ----------
  // Minlength
  // ----------

  // 8
  it('deve rejeitar userName com menos de 2 caracteres', async () => {
    const partner = new Partner({
      userName: 'J',
      email: 'joao@email.com',
      tel: '(11) 99999-9999',
      companyName: 'Mercado Exemplo',
      cnpj: '12345678000199',
      cep: '12345-678',
    });

    await expect(partner.validate()).rejects.toMatchObject({
      errors: {
        userName: expect.any(Object),
      },
    });
  });

  // ------
  // Match
  // ------

  // 9
  it('deve rejeitar telefone inválido', async () => {
    const partner = new Partner({
      userName: 'João Silva',
      email: 'joao@email.com',
      tel: '11999999999',
      companyName: 'Mercado Exemplo',
      cnpj: '12345678000199',
      cep: '12345-678',
    });

    await expect(partner.validate()).rejects.toMatchObject({
      errors: {
        tel: expect.any(Object),
      },
    });
  });

  // 10
  it('deve rejeitar CEP inválido', async () => {
    const partner = new Partner({
      userName: 'João Silva',
      email: 'joao@email.com',
      tel: '(11) 99999-9999',
      companyName: 'Mercado Exemplo',
      cnpj: '12345678000199',
      cep: '123',
    });

    await expect(partner.validate()).rejects.toMatchObject({
      errors: {
        cep: expect.any(Object),
      },
    });
  });

  // -----
  // Trim
  // -----

  // 11
  it('deve remover espaços de userName', () => {
    const partner = new Partner({
      userName: '  João Silva  ',
      email: 'joao@email.com',
      tel: '(11) 99999-9999',
      companyName: 'Mercado Exemplo',
      cnpj: '12345678000199',
      cep: '12345-678',
    });

    expect(partner.userName).toBe('João Silva');
  });
});
