// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP) > fluxo de logout
// requisição HTTP > celebrateForRefreshToken > logoutUser

describe('Logout Flow > POST "/auth/logout"', () => {
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
  it('Logout com sucesso', async () => {
    const res = await request.post('/auth/logout').set('Cookie', cookies);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(res.body).toMatchObject({
      message: 'Logout realizado',
    });

    const cookiesFromResponse = res.headers['set-cookie'];

    expect(Array.isArray(cookiesFromResponse)).toBe(true);
    expect(cookiesFromResponse).toHaveLength(2);

    const accessCookie = cookiesFromResponse.find((cookie) =>
      cookie.startsWith('accessToken='),
    );

    const refreshCookie = cookiesFromResponse.find((cookie) =>
      cookie.startsWith('refreshToken='),
    );

    expect(accessCookie).toContain('accessToken=;');
    expect(refreshCookie).toContain('refreshToken=;');

    expect(accessCookie).toContain('HttpOnly');
    expect(refreshCookie).toContain('HttpOnly');
  });

  // -------------------------
  // celebrateForRefreshToken
  // -------------------------

  // 2
  it('Exige refreshToken', async () => {
    const error = await request.post('/auth/logout');

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 3
  it('refreshToken fora do padrão JWT', async () => {
    const error = await request
      .post('/auth/logout')
      .set('Cookie', 'refreshToken=token-invalido');

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });
});
