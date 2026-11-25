// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import UserModel from '../../../src/modules/users/user.model.js';
import ProductModel from '../../../src/modules/menu/product.model.js';
import jwt from 'jsonwebtoken';
import env from '../../../src/config/env.js';
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de cadastro de novo produto
// requisição HTTP > celebrateForAccessToken > accessMiddleware > roleMiddleware('admin') > validateContentType > celebrateForRegisterNewProduct > registerNewProduct > DB

describe('Register New Product Flow > POST "/admin/menu"', () => {
  // ---------
  // Payloads
  // ---------

  const userPayload = {
    userName: 'Vanessa Yuri A. Brito',
    email: 'emaildavanessayuri@gmail.com',
    confirmEmail: 'emaildavanessayuri@gmail.com',
    tel: '(11) 98950-2164',
    password: 'senha123',
    confirmPassword: 'senha123',
  };

  const productPayload = {
    productName: 'Quinoa',
    category: 'carboidratos',
    qtyAvailable: 10,
    partnerName: 'Mercado novo',
    availableUntil: '2099-02-20',
  };

  // ------------------------------------------------------------------
  // Seed
  // Cadastro de usuário + atualização cadastral + login + accessToken
  // ------------------------------------------------------------------

  let cookies;

  beforeEach(async () => {
    const register = await request.post('/auth/register').send(userPayload);

    // Atualiza perfil do usuário para acesso administrativo
    const user = await UserModel.findOne({ email: register.body.email });
    user.role = 'admin';
    await user.save();

    const login = await request.post('/auth/login').send({
      email: userPayload.email,
      tel: userPayload.tel,
      password: userPayload.password,
    });

    cookies = login.headers['set-cookie'];
  });

  // -------
  // Válido
  // -------

  // 1
  it('Cadastro com sucesso + persistência', async () => {
    // Cadastro
    const res = await request
      .post('/admin/menu')
      .set('Cookie', cookies)
      .send(productPayload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    expect(res.body).toMatchObject(
      expect.objectContaining({
        productName: productPayload.productName,
        category: productPayload.category,
        qtyAvailable: productPayload.qtyAvailable,
        partnerName: productPayload.partnerName,
      }),
    );

    expect(new Date(res.body.availableUntil).toISOString()).toBe(
      new Date(productPayload.availableUntil).toISOString(),
    );

    // Persistência
    const newProduct = await ProductModel.findOne({
      productName: productPayload.productName,
    });

    expect(newProduct).not.toBeNull();
    expect(newProduct.category).toBe(productPayload.category);
    expect(newProduct.partnerName).toBe(productPayload.partnerName);
    expect(newProduct.availableUntil.toISOString()).toBe(
      new Date(productPayload.availableUntil).toISOString(),
    );
  });

  // ------------------------
  // celebrateForAccessToken
  // ------------------------

  // 2
  it('Exige accessToken', async () => {
    const error = await request.post('/admin/menu');

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 3
  it('accessToken fora do padrão JWT', async () => {
    const error = await request
      .post('/admin/menu')
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
      { _id: '123', role: 'admin' },
      env.JWT_SECRET,
      { expiresIn: '-1s' }, // token é gerado já expirado
    );

    const error = await request
      .post('/admin/menu')
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
      { _id: '123', role: 'admin' },
      'chave-errada',
      {
        expiresIn: '15m',
      },
    );

    const error = await request
      .post('/admin/menu')
      .set('Cookie', `accessToken=${invalidToken}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(401);

    expect(error.body.message).toBe(
      `${errorsMessages.unauthorized} Erro na autenticação do usuário: accessToken inválido.`,
    );
  });

  // ------------------------
  // roleMiddleware('admin')
  // ------------------------

  // 6
  it('Bloqueia role "user" com Forbidden (403)', async () => {
    // Atualiza perfil do usuário seed, para acesso de usuário
    const user = await UserModel.findOne({ email: userPayload.email });
    user.role = 'user';
    await user.save();

    // Loga novamente e seta cookies JWT
    const login = await request.post('/auth/login').send({
      email: userPayload.email,
      tel: userPayload.tel,
      password: userPayload.password,
    });

    cookies = login.headers['set-cookie'];

    // Teste
    const error = await request.post('/admin/menu').set('Cookie', cookies);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(403);

    expect(error.body.message).toBe(
      `${errorsMessages.forbidden} Acesso negado.`,
    );
  });

  // --------------------
  // validateContentType
  // --------------------

  // 7
  it('Content-Type inválido', async () => {
    const error = await request
      .post('/admin/menu')
      .set('Cookie', cookies)
      .set('Content-Type', 'text/plain')
      .send('teste de header content-type');

    // pq com '.send(productPayload)', o Supertest envia JSON automaticamente, adicionando 'Content-Type: application/json' implicitamente

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(415);

    expect(error.body.message).toBe(
      `${errorsMessages.unsupportedMediaType} Content-Type deve ser application/json.`,
    );
  });

  // -------------------------------
  // celebrateForRegisterNewProduct
  // -------------------------------

  // 8
  it('Exige productName', async () => {
    const error = await request
      .post('/admin/menu')
      .set('Cookie', cookies)
      .send({ ...productPayload, productName: undefined });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 9
  it('Exige category', async () => {
    const error = await request
      .post('/admin/menu')
      .set('Cookie', cookies)
      .send({ ...productPayload, category: undefined });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 10
  it('Exige qtyAvailable', async () => {
    const error = await request
      .post('/admin/menu')
      .set('Cookie', cookies)
      .send({ ...productPayload, qtyAvailable: undefined });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 11
  it('Exige partnerName', async () => {
    const error = await request
      .post('/admin/menu')
      .set('Cookie', cookies)
      .send({ ...productPayload, partnerName: undefined });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 12
  it('Exige availableUntil', async () => {
    const error = await request
      .post('/admin/menu')
      .set('Cookie', cookies)
      .send({ ...productPayload, availableUntil: undefined });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 13
  it('Bloqueia "category" com valor não permitido', async () => {
    const error = await request
      .post('/admin/menu')
      .set('Cookie', cookies)
      .send({ ...productPayload, category: 'frango' });

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });
});
