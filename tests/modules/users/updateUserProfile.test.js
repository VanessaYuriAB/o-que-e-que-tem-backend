// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import jwt from 'jsonwebtoken';
import env from '../../../src/config/env.js';
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';
import mongoose from 'mongoose';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de atualização de perfil do usuário
// requisição HTTP > celebrateForAccessToken > accessMiddleware > validateContentType > celebrateForUpdateUser > updateUserProfile

describe('Update User Profile Flow > PATCH "/users/me"', () => {
  // --------
  // Payload
  // --------

  const userPayload = {
    userName: 'Vanessa Yuri A. Brito',
    email: 'emaildavanessayuri@gmail.com',
    tel: '(11) 98950-2164',
    address: 'Rua teste',
    number: '123',
    complement: 'Apto 123',
    district: 'Bairro teste',
    cep: '12345-678',
    infoText: 'Observação teste',
  };

  // ------------------------------------------
  // Seed
  // Cadastro do usuário + login + accessToken
  // ------------------------------------------

  let cookies;

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
  });

  // -------
  // Válido
  // -------

  // 1
  it('Atualização de perfil de usuário bem sucedida', async () => {
    const res = await request
      .patch('/users/me')
      .set('Cookie', cookies)
      .send({
        ...userPayload,
        address: 'Rua atualizada',
      });

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(res.body).toMatchObject({
      userName: userPayload.userName,
      email: userPayload.email,
      tel: userPayload.tel,
      address: 'Rua atualizada',
      number: userPayload.number,
      complement: userPayload.complement,
      district: userPayload.district,
      cep: userPayload.cep,
      infoText: userPayload.infoText,

      _id: expect.stringMatching(/^[0-9a-fA-F]{24}$/), // formato de ObjectId do Mongo DB
      role: 'user',
    });

    expect(res.body).not.toHaveProperty('password');
  });

  // ------------------------
  // celebrateForAccessToken
  // ------------------------

  // 2
  it('Exige accessToken', async () => {
    const error = await request.patch('/users/me');

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 3
  it('accessToken fora do padrão JWT', async () => {
    const error = await request
      .patch('/users/me')
      .set('Cookie', 'accessToken=token-invalido');

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -----------------
  // accessMiddleware
  // -----------------

  // 4
  it('accessToken expirado', async () => {
    const expiredToken = jwt.sign(
      { _id: '123', role: 'user' },
      env.JWT_SECRET,
      { expiresIn: '-1s' }, // token é gerado já expirado
    );

    const error = await request
      .patch('/users/me')
      .set('Cookie', `accessToken=${expiredToken}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body.message).toBe(
      `${errorsMessages.unauthorized} Erro na autenticação do usuário: accessToken inválido.`,
    );
  });

  // 5
  it('accessToken assinado com chave inválida', async () => {
    const invalidToken = jwt.sign(
      { _id: '123', role: 'user' },
      'chave-errada',
      {
        expiresIn: '15m',
      },
    );

    const error = await request
      .patch('/users/me')
      .set('Cookie', `accessToken=${invalidToken}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body.message).toBe(
      `${errorsMessages.unauthorized} Erro na autenticação do usuário: accessToken inválido.`,
    );
  });

  // --------------------
  // validateContentType
  // --------------------

  // 6
  it('Content-Type inválido', async () => {
    const error = await request
      .patch('/users/me')
      .set('Cookie', cookies)
      .set('Content-Type', 'text/plain')
      .send('teste de header content-type');

    // pq com '.send(userPayload)', o Supertest envia JSON automaticamente, adicionando 'Content-Type: application/json' implicitamente

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(415);

    expect(error.body.message).toBe(
      `${errorsMessages.unsupportedMediaType} Content-Type deve ser application/json.`,
    );
  });

  // -----------------------
  // celebrateForUpdateUser
  // -----------------------

  // 7
  it('userName inválido', async () => {
    const error = await request
      .patch('/users/me')
      .set('Cookie', cookies)
      .send({
        ...userPayload,
        userName: '<Vanessa>',
      });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 8
  it('email inválido', async () => {
    const error = await request
      .patch('/users/me')
      .set('Cookie', cookies)
      .send({
        ...userPayload,
        email: 'email-invalido',
        confirmEmail: 'email-invalido',
      });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 9
  it('tel inválido', async () => {
    const error = await request
      .patch('/users/me')
      .set('Cookie', cookies)
      .send({
        ...userPayload,
        tel: '11989502164',
      });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 10
  it('address inválido', async () => {
    const error = await request
      .patch('/users/me')
      .set('Cookie', cookies)
      .send({
        ...userPayload,
        address: '<Address inválido>',
      });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 11
  it('number inválido', async () => {
    const error = await request
      .patch('/users/me')
      .set('Cookie', cookies)
      .send({
        ...userPayload,
        number: 'Nº com símbolo',
      });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 12
  it('complement inválido', async () => {
    const error = await request
      .patch('/users/me')
      .set('Cookie', cookies)
      .send({
        ...userPayload,
        complement: '<Complement inválido>',
      });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 13
  it('district inválido', async () => {
    const error = await request
      .patch('/users/me')
      .set('Cookie', cookies)
      .send({
        ...userPayload,
        district: '<District inválido>',
      });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 14
  it('cep inválido', async () => {
    const error = await request
      .patch('/users/me')
      .set('Cookie', cookies)
      .send({
        ...userPayload,
        cep: '0123456',
      });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 15
  it('infoText inválido', async () => {
    const error = await request
      .patch('/users/me')
      .set('Cookie', cookies)
      .send({
        ...userPayload,
        infoText: '<infoText inválido>',
      });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------
  // NotFoundError (404)
  // --------------------

  // 16
  it('Atualização de perfil de usuário mal sucedida', async () => {
    // Gera token válido com _id inexistente
    const fakeToken = jwt.sign(
      {
        _id: new mongoose.Types.ObjectId(),
        role: 'user',
      },
      env.JWT_SECRET,
      {
        expiresIn: '15m',
      },
    );

    const error = await request
      .patch('/users/me')
      .set('Cookie', `accessToken=${fakeToken}`)
      .send({
        userName: 'Sem ID cadastrado',
      });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(404);

    expect(error.body.message).toBe(
      `${errorsMessages.notFound} Erro ao atualizar perfil cadastral: não existe usuário com o id solicitado (Recurso não encontrado).`,
    );
  });
});
