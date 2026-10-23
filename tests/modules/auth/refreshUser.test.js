// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import jwt from 'jsonwebtoken';
import env from '../../../src/config/env.js';
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP) > fluxo de recuperação de sessão existente (refreshUser)
// requisição HTTP > celebrateForRefreshToken > refreshMiddleware > refreshUser

describe('Refresh User Flow > GET "/auth/me"', () => {
  // ------------------------------------------
  // Seed
  // Cadastro do usuário + login + refreshToken
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
  it('Recuperação de sessão bem sucedida', async () => {
    const res = await request.get('/auth/me').set('Cookie', cookies);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(res.body).toMatchObject({
      loggedUser: expect.objectContaining({
        userName: 'Vanessa Yuri A. Brito',
        email: 'emaildavanessayuri@gmail.com',
        tel: '(11) 98950-2164',
      }),
    });
  });

  // -------------------
  // Unauthorized (401)
  // -------------------

  // 2
  it('refreshToken expirado', async () => {
    const expiredToken = jwt.sign(
      { _id: '123' },
      env.JWT_SECRET,
      { expiresIn: '-1s' }, // token é gerado já expirado
    );

    const error = await request
      .get('/auth/me')
      .set('Cookie', `refreshToken=${expiredToken}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body.message).toBe(
      `${errorsMessages.unauthorized} Erro na recuperação da sessão do usuário: refreshToken inválido.`,
    );
  });

  // 3
  it('refreshToken assinado com chave inválida', async () => {
    const invalidToken = jwt.sign({ _id: '123' }, 'chave-errada', {
      expiresIn: '7d',
    });

    const error = await request
      .get('/auth/me')
      .set('Cookie', `refreshToken=${invalidToken}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body.message).toBe(
      `${errorsMessages.unauthorized} Erro na recuperação da sessão do usuário: refreshToken inválido.`,
    );
  });

  // -------------------------
  // celebrateForRefreshToken
  // -------------------------

  // 4
  it('Exige refreshToken', async () => {
    const error = await request.get('/auth/me');

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 5
  it('refreshToken fora do padrão JWT', async () => {
    const error = await request
      .get('/auth/me')
      .set('Cookie', 'refreshToken=token-invalido');

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });
});
