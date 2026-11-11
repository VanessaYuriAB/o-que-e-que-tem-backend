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

// Express test service
const { default: app } = await import('../../../src/app.js');

// Utils
import jwt from 'jsonwebtoken';
import env from '../../../src/config/env.js';
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';
import MessageModel from '../../../src/modules/contact/message.model.js';
import UserModel from '../../../src/modules/users/user.model.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de busca de mensagens do usuário
// requisição HTTP > celebrateForAccessToken > celebrateForGetUserMsgs > accessMiddleware > isOwnerOrAdminMiddleware > getUserMsgs

describe('Get User Messages Flow > GET "/users/:userId/messages"', () => {
  // -------------------------------------------------------------------------------------------
  // Seed
  // Cadastro do usuário + login + access e refresh Tokens + refreshUser (id) + cadastro de msg
  // -------------------------------------------------------------------------------------------

  let cookies;
  let userId;

  beforeEach(async () => {
    await request.post('/auth/register').send({
      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      confirmEmail: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      password: 'senha123',
      confirmPassword: 'senha123',
    });

    const login = await request.post('/auth/login').send({
      email: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      password: 'senha123',
    });

    cookies = login.headers['set-cookie'];

    const refresh = await request.get('/auth/me').set('Cookie', cookies);

    userId = refresh.body._id;

    await request.post('/messages').send({
      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      whatsapp: '(11) 98950-2164',
      message: 'Olá! Fazendo teste para busca de mensagens de usuário.',
      method: 'whatsapp',
    });
  });

  // --------
  // Válidos
  // --------

  // 1
  it('Deve retornar array com objetos de mensagens', async () => {
    const res = await request
      .get(`/users/${userId}/messages`)
      .set('Cookie', cookies);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).not.toHaveLength(0);
  });

  // 2
  it('Os objetos do array retornado devem conter os campos esperados', async () => {
    const res = await request
      .get(`/users/${userId}/messages`)
      .set('Cookie', cookies);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveLength(1);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.stringMatching(/^[0-9a-fA-F]{24}$/), // formato de ObjectId do Mongo DB

          owner: userId,

          userName: 'Vanessa Yuri A. Brito',
          email: 'emaildavanessayuri@gmail.com',
          whatsapp: '(11) 98950-2164',
          message: 'Olá! Fazendo teste para busca de mensagens de usuário.',
          method: 'whatsapp',

          status: false,
          responseAt: null,
          response: null,

          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    );
  });

  // 3
  it('Deve retornar array vazio quando não houver msg cadastrada', async () => {
    await MessageModel.deleteMany({});

    const res = await request
      .get(`/users/${userId}/messages`)
      .set('Cookie', cookies);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual([]);
  });

  // ------------------------
  // celebrateForAccessToken
  // ------------------------

  // 4
  it('Exige accessToken', async () => {
    const error = await request.get(`/users/${userId}/messages`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 5
  it('accessToken fora do padrão JWT', async () => {
    const error = await request
      .get(`/users/${userId}/messages`)
      .set('Cookie', 'accessToken=token-invalido');

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ---------------------------------
  // celebrateForGetUserMsgs (params)
  // ---------------------------------

  // 6
  it('userId deve possuir formato válido de ObjectId', async () => {
    const error = await request
      .get('/users/id-invalido/messages')
      .set('Cookie', cookies);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -----------------
  // accessMiddleware
  // -----------------

  // 7
  it('accessToken expirado', async () => {
    const expiredToken = jwt.sign(
      { _id: '123', role: 'user' },
      env.JWT_SECRET,
      { expiresIn: '-1s' }, // token é gerado já expirado
    );

    const error = await request
      .get(`/users/${userId}/messages`)
      .set('Cookie', `accessToken=${expiredToken}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body.message).toBe(
      `${errorsMessages.unauthorized} Erro na autenticação do usuário: accessToken inválido.`,
    );
  });

  // 8
  it('accessToken assinado com chave inválida', async () => {
    const invalidToken = jwt.sign(
      { _id: '123', role: 'user' },
      'chave-errada',
      {
        expiresIn: '15m',
      },
    );

    const error = await request
      .get(`/users/${userId}/messages`)
      .set('Cookie', `accessToken=${invalidToken}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body.message).toBe(
      `${errorsMessages.unauthorized} Erro na autenticação do usuário: accessToken inválido.`,
    );
  });

  // -------------------------
  // isOwnerOrAdminMiddleware
  // -------------------------

  // 9
  it('Bloqueia acesso a mensagens de outro usuário', async () => {
    // Seed (usuário B)
    // Cadastro + login + access e refresh Tokens + refreshUser (id) + cadastro de msg

    await request.post('/auth/register').send({
      userName: 'User B',
      email: 'userb@gmail.com',
      confirmEmail: 'userb@gmail.com',
      tel: '(11) 98765-4321',
      password: 'senha456',
      confirmPassword: 'senha456',
    });

    const login = await request.post('/auth/login').send({
      email: 'userb@gmail.com',
      tel: '(11) 98765-4321',
      password: 'senha456',
    });

    const cookiesB = login.headers['set-cookie'];

    const refresh = await request.get('/auth/me').set('Cookie', cookiesB);

    const userIdB = refresh.body._id;

    await request.post('/messages').send({
      userName: 'User B',
      email: 'userb@gmail.com',
      whatsapp: '(11) 98765-4321',
      message: 'Olá! Fazendo teste para busca de mensagens de usuário.',
      method: 'whatsapp',
    });

    // Teste
    const error = await request
      .get(`/users/${userIdB}/messages`)
      .set('Cookie', cookies);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(403);

    expect(error.body.message).toBe(
      `${errorsMessages.forbidden} Acesso negado.`,
    );
  });

  // 10
  it('admin pode acessar mensagens de qualquer usuário', async () => {
    // Seed (admin)
    // Cadastro + login + access e refresh Tokens + refreshUser (id)

    await request.post('/auth/register').send({
      userName: 'Admin',
      email: 'admin@gmail.com',
      confirmEmail: 'admin@gmail.com',
      tel: '(11) 99999-9999',
      password: 'senha789',
      confirmPassword: 'senha789',
    });

    await UserModel.findOneAndUpdate(
      { email: 'admin@gmail.com' },
      { role: 'admin' },
      {
        returnDocument: 'after', // substitui o 'new: true,' atualmente
        runValidators: true,
      },
    );

    const login = await request.post('/auth/login').send({
      email: 'admin@gmail.com',
      tel: '(11) 99999-9999',
      password: 'senha789',
    });

    const cookiesAdmin = login.headers['set-cookie'];

    // Teste
    const res = await request
      .get(`/users/${userId}/messages`)
      .set('Cookie', cookiesAdmin);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);

    expect(res.body[0].owner).toBe(userId);
  });
});
