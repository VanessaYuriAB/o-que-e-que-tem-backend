// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import UserModel from '../../../src/modules/users/user.model.js';
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de cadastro de usuário
// requisição HTTP > validateContentType > celebrateForRegister > registerUser > DB

describe('Register Flow > POST "/auth/register"', () => {
  // --------
  // Payload
  // --------

  const userPayload = {
    userName: 'Vanessa Yuri A. Brito',
    email: 'emaildavanessayuri@gmail.com',
    confirmEmail: 'emaildavanessayuri@gmail.com',
    tel: '(11) 98950-2164',
    password: 'senha123',
    confirmPassword: 'senha123',
  };

  // -------
  // Válido
  // -------

  // 1
  it('Cadastro com sucesso + persistência', async () => {
    // Cadastro
    const res = await request.post('/auth/register').send(userPayload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    expect(res.body).toMatchObject(
      expect.objectContaining({
        userName: userPayload.userName,
        email: userPayload.email,
        tel: userPayload.tel,
      }),
    );

    expect(res.body.password).toBeUndefined(); // senha não é retornada, msm em hash

    // Persistência
    const createdUser = await UserModel.findOne({
      email: userPayload.email,
    });

    expect(createdUser.email).toBe(userPayload.email);
    expect(createdUser).not.toBeNull();
  });

  // ----------------------------
  // registerUser (User.findOne)
  // ----------------------------

  // 2
  it('E-mail duplicado', async () => {
    // Cria seed (201)
    const res = await request.post('/auth/register').send({
      ...userPayload,
    });

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    // Envia o mesmo cadastro (409)
    const error = await request.post('/auth/register').send(userPayload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(409);

    expect(error.body).toHaveProperty('message');
    expect(error.body.message).toBe(
      `${errorsMessages.conflict} E-mail duplicado.`,
    );
  });

  // 3
  it('Senha hashada (bcrypt)', async () => {
    // Cria seed (201)
    const res = await request.post('/auth/register').send({
      ...userPayload,
    });

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    // Verifica hash
    const user = await UserModel.findOne({
      email: userPayload.email,
    }).select('+password');

    expect(user).not.toBeNull();
    expect(user.password).not.toBe(userPayload.password);
  });

  // ---------------------
  // celebrateForRegister
  // ---------------------

  // 4
  it('email inválido', async () => {
    const error = await request.post('/auth/register').send({
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

  // 5
  it('Password inválida', async () => {
    const error = await request
      .post('/auth/register')
      .send({ ...userPayload, password: 'senha' });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 6
  it('confirmPassword diferente', async () => {
    const error = await request
      .post('/auth/register')
      .send({ ...userPayload, confirmPassword: 'senha' });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 7
  it('Body ausente', async () => {
    const error = await request.post('/auth/register').send({});

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------
  // validateContentType
  // --------------------

  // 8
  it('Content-Type inválido', async () => {
    const error = await request
      .post('/auth/register')
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
