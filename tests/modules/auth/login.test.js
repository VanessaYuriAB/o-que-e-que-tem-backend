// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de login
// requisição HTTP > validateContentType > celebrateForLogin > loginUser > DB

describe('Login Flow > POST "/auth/login"', () => {
  // ---------------------------
  // Seed (cadastro do usuário)
  // ---------------------------

  beforeEach(async () => {
    await request.post('/auth/register').send({
      userName: 'Vanessa Yuri A. Brito',
      email: 'emaildavanessayuri@gmail.com',
      confirmEmail: 'emaildavanessayuri@gmail.com',
      tel: '(11) 98950-2164',
      password: 'senha123',
      confirmPassword: 'senha123',
    });
  });

  // --------
  // Payload
  // --------

  const userPayload = {
    email: 'emaildavanessayuri@gmail.com',
    tel: '(11) 98950-2164',
    password: 'senha123',
  };

  // -------
  // Válido
  // -------

  // 1
  it('Login com sucesso', async () => {
    const res = await request.post('/auth/login').send(userPayload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(200);

    expect(res.body).toMatchObject(expect.objectContaining({ success: true }));

    const cookies = res.headers['set-cookie'];

    expect(Array.isArray(cookies)).toBe(true);
    expect(cookies).toHaveLength(2);

    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^accessToken=/),
        expect.stringMatching(/^refreshToken=/),
      ]),
    );

    cookies.forEach((cookie) => {
      expect(cookie).toContain('HttpOnly');
    });
  });

  // ------------------------------------------
  // Unauthorized (401): findUserByCredentials
  // ------------------------------------------

  // 2
  it('E-mail não encontrado', async () => {
    const error = await request.post('/auth/login').send({
      ...userPayload,
      email: 'naoexiste@email.com',
    });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body).toMatchObject({
      message: expect.stringMatching(
        `${errorsMessages.unauthorized} Login não autenticado.`,
      ),
    });
  });

  // 3
  it('Senha incorreta', async () => {
    const error = await request.post('/auth/login').send({
      ...userPayload,
      password: 'senhaErrada123',
    });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body).toMatchObject({
      message: expect.stringMatching(
        `${errorsMessages.unauthorized} Login não autenticado.`,
      ),
    });
  });

  // ------------------
  // celebrateForLogin
  // ------------------

  // 4
  it('Exige e-mail', async () => {
    const { tel, password } = userPayload;
    const payloadSemEmail = { tel, password };

    const error = await request.post('/auth/login').send(payloadSemEmail);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 5
  it('Exige telefone', async () => {
    const { email, password } = userPayload;
    const payloadSemTel = { email, password };

    const error = await request.post('/auth/login').send(payloadSemTel);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 6
  it('Exige senha', async () => {
    const { email, tel } = userPayload;
    const payloadSemPassword = { email, tel };

    const error = await request.post('/auth/login').send(payloadSemPassword);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------
  // validateContentType
  // --------------------

  // 7
  it('Content-Type inválido', async () => {
    const error = await request
      .post('/auth/login')
      .set('Content-Type', 'text/plain')
      .send('teste de header content-type');

    // pq com '.send(userPayload)', o Supertest envia JSON automaticamente, adicionando 'Content-Type: application/json' implicitamente

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(415);

    expect(error.body.message).toBe(
      `${errorsMessages.unsupportedMediaType} Content-Type deve ser application/json.`,
    );
  });
});
