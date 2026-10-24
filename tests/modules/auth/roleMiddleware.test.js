// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';
import jwt from 'jsonwebtoken';
import env from '../../../src/config/env.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP) > fluxo de autorização (role middleware)
// requisição HTTP > celebrateForAccessToken (JWT) > accessMiddleware > roleMiddleware('admin') > controller

describe('Role Middleware Flow > GET "/auth/admin-health" > Rota dev/test', () => {
  // -------
  // Válido
  // -------

  // 1
  it('permite acesso para admin', async () => {
    const adminPayload = jwt.sign(
      { _id: '123', role: 'admin' },
      env.JWT_SECRET,
      { expiresIn: '15m' }, // payload é gerado como role: 'admin'
    );

    const res = await request
      .get('/auth/admin-health')
      .set('Cookie', `accessToken=${adminPayload}`);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(res.body).toMatchObject({
      status: 'auth admin ok',
      role: 'admin',
    });
  });

  // ----------------
  // Forbidden (403)
  // ----------------

  // 2
  it('bloqueia user em rota admin', async () => {
    // Cadastro de usuário
    await request.post('/auth/register').send({
      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      confirmEmail: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      password: 'senha123',
      confirmPassword: 'senha123',
    });

    // Login
    const login = await request.post('/auth/login').send({
      email: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      password: 'senha123',
    });

    // Cookies
    const cookies = login.headers['set-cookie'];

    // Teste
    const error = await request
      .get('/auth/admin-health')
      .set('Cookie', cookies);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(403);

    expect(error.body.message).toBe(
      `${errorsMessages.forbidden} Acesso negado.`,
    );
  });

  // 3
  it('role inexistente recebe 403', async () => {
    const invalidPayload = jwt.sign(
      { _id: '123' },
      env.JWT_SECRET,
      { expiresIn: '15m' }, // payload é gerado sem o campo 'role'
    );

    const error = await request
      .get('/auth/admin-health')
      .set('Cookie', `accessToken=${invalidPayload}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(403);

    expect(error.body.message).toBe(
      `${errorsMessages.forbidden} Acesso negado.`,
    );
  });

  // 4
  it('bloqueia role diferente das permitidas (rota admin)', async () => {
    const invalidPayload = jwt.sign(
      { _id: '123', role: 'manager' },
      env.JWT_SECRET,
      { expiresIn: '15m' }, // payload é gerado como role: 'manager'
    );

    const error = await request
      .get('/auth/admin-health')
      .set('Cookie', `accessToken=${invalidPayload}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(403);

    expect(error.body.message).toBe(
      `${errorsMessages.forbidden} Acesso negado.`,
    );
  });
});
