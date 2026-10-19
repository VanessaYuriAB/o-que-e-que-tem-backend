import Message from '../../src/modules/contact/message.model.js';

describe('Message Model', () => {
  const validMessage = {
    userName: 'João Silva',
    email: 'joao@email.com',
    whatsapp: '(11) 98765-4321',
    message: 'Gostaria de mais informações.',
    method: 'email',
  };

  // -------
  // Válido
  // -------

  // 1
  it('deve criar uma mensagem válida', async () => {
    const msg = new Message(validMessage);

    await expect(msg.validate()).resolves.toBeUndefined();
  });

  // --------
  // Default
  // --------

  // 2
  it('deve definir owner como null por padrão', () => {
    const msg = new Message(validMessage);

    expect(msg.owner).toBeNull();
  });

  // 3
  it('deve definir status como false por padrão', () => {
    const msg = new Message(validMessage);

    expect(msg.status).toBe(false);
  });

  // 4
  it('deve definir responseAt como null por padrão', () => {
    const msg = new Message(validMessage);

    expect(msg.responseAt).toBeNull();
  });

  // 5
  it('deve definir response como null por padrão', () => {
    const msg = new Message(validMessage);

    expect(msg.response).toBeNull();
  });

  // ---------
  // userName
  // ---------

  // 6
  it('deve exigir userName', async () => {
    const msg = new Message({
      ...validMessage,
      userName: undefined,
    });

    await expect(msg.validate()).rejects.toThrow();
  });

  // 7
  it('deve rejeitar nome menor que 2 caracteres', async () => {
    const msg = new Message({
      ...validMessage,
      userName: 'A',
    });

    await expect(msg.validate()).rejects.toThrow();
  });

  // 8
  it('deve rejeitar HTML (userName)', async () => {
    const msg = new Message({
      ...validMessage,
      userName: '<script>',
    });

    await expect(msg.validate()).rejects.toThrow();
  });

  // ------
  // email
  // ------

  // 9
  it('deve exigir email', async () => {
    const msg = new Message({
      ...validMessage,
      email: undefined,
    });

    await expect(msg.validate()).rejects.toThrow();
  });

  // 10
  it('deve rejeitar email inválido', async () => {
    const msg = new Message({
      ...validMessage,
      email: 'email-invalido',
    });

    await expect(msg.validate()).rejects.toThrow();
  });

  // ---------
  // whatsapp
  // ---------

  // 11
  it('deve exigir whatsapp', async () => {
    const msg = new Message({
      ...validMessage,
      whatsapp: undefined,
    });

    await expect(msg.validate()).rejects.toThrow();
  });

  // 12
  it('deve rejeitar formato inválido', async () => {
    const msg = new Message({
      ...validMessage,
      whatsapp: '11987654321',
    });

    await expect(msg.validate()).rejects.toThrow();
  });

  // --------
  // message
  // --------

  // 13
  it('deve exigir mensagem', async () => {
    const msg = new Message({
      ...validMessage,
      message: undefined,
    });

    await expect(msg.validate()).rejects.toThrow();
  });

  // 14
  it('deve rejeitar HTML (message)', async () => {
    const msg = new Message({
      ...validMessage,
      message: '<script>',
    });

    await expect(msg.validate()).rejects.toThrow();
  });

  // -------
  // method
  // -------

  // 15
  it('deve rejeitar valor fora do enum', async () => {
    const msg = new Message({
      ...validMessage,
      method: 'telefone',
    });

    await expect(msg.validate()).rejects.toThrow();
  });

  // -----------
  // responseAt
  // -----------

  // 16
  it('deve aceitar Date', async () => {
    const msg = new Message({
      ...validMessage,
      responseAt: new Date(),
    });

    await expect(msg.validate()).resolves.toBeUndefined();
  });
});
