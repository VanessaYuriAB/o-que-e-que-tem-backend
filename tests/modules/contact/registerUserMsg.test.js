// Supertest
import supertest from 'supertest';

// Resend
import { jest } from '@jest/globals';

jest.unstable_mockModule(
  '../../../src/shared/services/email.service.js',
  () => ({
    default: jest.fn(),
  }),
);

const { default: sendEmail } =
  await import('../../../src/shared/services/email.service.js');

// Express test service
const { default: app } = await import('../../../src/app.js');
// Utils
import UserModel from '../../../src/modules/users/user.model.js';
import MessageModel from '../../../src/modules/contact/message.model.js';
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de cadastro de mensagem + envio de e-mail de notificação ao admin
// requisição HTTP > validateContentType > celebrateForRegisterUserMsg > registerUserMsg > Service (com email.service mockado)

describe('Register User Msg Flow > POST "/messages"', () => {
  // Limpeza do mock (acúmulo de chamadas, para testes de sucesso)
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --------
  // Payload
  // --------

  const messagePayload = {
    userName: 'Nome do usuário',
    email: 'email@teste.com',
    whatsapp: '(11) 98765-4321',
    message: 'Olá! Fazendo teste para cadastro de mensagens.',
    method: 'whatsapp',
  };

  // --------
  // Válidos
  // --------

  // 1
  it('Cadastro de mensagem bem sucedido (usuário já cadastrado) + persistência + acionamento do serviço de notificação', async () => {
    // Seed (cadastro de usuário)
    await request.post('/auth/register').send({
      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      confirmEmail: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      password: 'senha123',
      confirmPassword: 'senha123',
    });

    // Seed (login)
    await request.post('/auth/login').send({
      email: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      password: 'senha123',
    });

    // Mensagem
    const res = await request.post('/messages').send({
      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      whatsapp: '(11) 98950-2164',
      message:
        'Olá! Fazendo teste para cadastro de mensagens com usuário já cadastrado.',
      method: 'email',
    });

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    expect(res.body).toMatchObject({
      owner: expect.stringMatching(/^[0-9a-fA-F]{24}$/), // formato de ObjectId do Mongo DB

      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      whatsapp: '(11) 98950-2164',

      message:
        'Olá! Fazendo teste para cadastro de mensagens com usuário já cadastrado.',

      method: 'email',

      status: false,
      responseAt: null,
      response: null,
    });

    expect(sendEmail).toHaveBeenCalledTimes(1);

    expect(sendEmail).toHaveBeenCalledWith(
      expect.any(String), // emailTo
      'Nova mensagem de usuário recebida', // emailSubject
      expect.any(String), // emailHtml
    );

    // Persistência
    const user = await UserModel.findOne({
      email: 'emaildavanessayuri@gmail.com',
    });

    expect(user).not.toBeNull();

    const msg = await MessageModel.findOne({
      owner: user._id,
    });

    expect(msg).not.toBeNull();
    expect(msg.owner.equals(user._id)).toBe(true); // dois ObjectIds do Mongoose

    expect(msg.userName).toBe('Vanessa Yuri A. Brito');
    expect(msg.email).toBe('emaildavanessayuri@gmail.com');
    expect(msg.whatsapp).toBe('(11) 98950-2164');
    expect(msg.message).toBe(
      'Olá! Fazendo teste para cadastro de mensagens com usuário já cadastrado.',
    );
    expect(msg.method).toBe('email');

    expect(msg.status).toBe(false);
    expect(msg.responseAt).toBeNull();
    expect(msg.response).toBeNull();

    expect(msg.createdAt).toBeDefined();
    expect(msg.updatedAt).toBeDefined();
  });

  // 2
  it('Cadastro de mensagem bem sucedido (usuário não cadastrado) + persistência + acionamento do serviço de notificação', async () => {
    // Mensagem
    const res = await request.post('/messages').send(messagePayload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    expect(res.body).toMatchObject({
      owner: null,

      userName: messagePayload.userName,
      email: messagePayload.email,
      whatsapp: messagePayload.whatsapp,

      message: messagePayload.message,

      method: messagePayload.method,

      status: false,
      responseAt: null,
      response: null,
    });

    expect(sendEmail).toHaveBeenCalledTimes(1);

    expect(sendEmail).toHaveBeenCalledWith(
      expect.any(String), // emailTo
      'Nova mensagem de usuário recebida', // emailSubject
      expect.any(String), // emailHtml
    );

    // Persistência
    const msg = await MessageModel.findOne({
      email: messagePayload.email,
    });

    expect(msg).not.toBeNull();
    expect(msg.owner).toBeNull();

    expect(msg.userName).toBe(messagePayload.userName);
    expect(msg.email).toBe(messagePayload.email);
    expect(msg.whatsapp).toBe(messagePayload.whatsapp);
    expect(msg.message).toBe(messagePayload.message);
    expect(msg.method).toBe(messagePayload.method);

    expect(msg.status).toBe(false);
    expect(msg.responseAt).toBeNull();
    expect(msg.response).toBeNull();

    expect(msg.createdAt).toBeDefined();
    expect(msg.updatedAt).toBeDefined();
  });

  // --------------------
  // validateContentType
  // --------------------

  // 3
  it('Content-Type inválido', async () => {
    const error = await request
      .post('/messages')
      .set('Content-Type', 'text/plain')
      .send('teste de header content-type');

    // pq com '.send(messagePayload)', o Supertest envia JSON automaticamente, adicionando 'Content-Type: application/json' implicitamente

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(415);

    expect(error.body.message).toBe(
      `${errorsMessages.unsupportedMediaType} Content-Type deve ser application/json.`,
    );
  });

  // ---------------------------------------
  // celebrateForRegisterUserMsg (required)
  // ---------------------------------------

  // 4
  it('Exige userName', async () => {
    const payload = { ...messagePayload };

    delete payload.userName;

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 5
  it('Exige email', async () => {
    const payload = { ...messagePayload };

    delete payload.email;

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 6
  it('Exige whatsapp', async () => {
    const payload = { ...messagePayload };

    delete payload.whatsapp;

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 7
  it('Exige message', async () => {
    const payload = { ...messagePayload };

    delete payload.message;

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 8
  it('Exige method', async () => {
    const payload = { ...messagePayload };

    delete payload.method;

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ---------------------------------------
  // celebrateForRegisterUserMsg (userName)
  // ---------------------------------------

  // 9
  it('userName deve conter, no mínimo, 2 caracteres', async () => {
    const payload = { ...messagePayload, userName: 'N' };

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 10
  it('userName deve conter, no máximo, 40 caracteres', async () => {
    const payload = { ...messagePayload, userName: 'N'.repeat(41) };

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 11
  it('userName deve rejeitar os caracteres HTML básicos (< e >)', async () => {
    const payload = { ...messagePayload, userName: '<Nome do usuário>' };

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ------------------------------------
  // celebrateForRegisterUserMsg (email)
  // ------------------------------------

  // 12
  it('email deve deve ser um e-mail válido', async () => {
    const payload = { ...messagePayload, email: 'email-invalido' };

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ---------------------------------------
  // celebrateForRegisterUserMsg (whatsapp)
  // ---------------------------------------

  // 13
  it('whatsapp deve seguir estrutura padronizada: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX', async () => {
    const payload = { ...messagePayload, whatsapp: '11 987654321' };

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 14
  it('whatsapp deve conter, no mínimo, 14 caracteres', async () => {
    const payload = { ...messagePayload, whatsapp: '9'.repeat(13) };

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 15
  it('whatsapp deve conter, no máximo, 15 caracteres', async () => {
    const payload = { ...messagePayload, whatsapp: '9'.repeat(16) };

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------------------------
  // celebrateForRegisterUserMsg (message)
  // --------------------------------------

  // 16
  it('message deve rejeitar os caracteres HTML básicos (< e >)', async () => {
    const payload = {
      ...messagePayload,
      message: '<Olá! Fazendo teste para cadastro de mensagens.>',
    };

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -------------------------------------
  // celebrateForRegisterUserMsg (method)
  // -------------------------------------

  // 17
  it('method deve rejeitar valores não definidos', async () => {
    const payload = {
      ...messagePayload,
      method: 'tel',
    };

    const error = await request.post('/messages').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });
});
