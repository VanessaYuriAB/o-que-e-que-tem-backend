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

// Testes de integração (HTTP + DB) > fluxo de exclusão de produto
// requisição HTTP > celebrateForAccessToken > accessMiddleware > roleMiddleware('admin') > celebrateForDeleteProduct > deleteProduct > DB

describe('Delete Product Flow > DELETE "/admin/menu/:productId"', () => {
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

  // ----------------------------------------------------------------------------------------
  // Seed
  // Cadastro de usuário + atualização cadastral + login + accessToken + cadastro de produto
  // ----------------------------------------------------------------------------------------

  let cookies;
  let productId;

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

    await request
      .post('/admin/menu')
      .set('Cookie', cookies)
      .send(productPayload);

    const product = await ProductModel.findOne({
      productName: productPayload.productName,
    });

    productId = product._id;
  });

  // -------
  // Válido
  // -------

  // 1
  it('Remove com sucesso + persistência', async () => {
    // Delete
    const res = await request
      .delete(`/admin/menu/${productId}`)
      .set('Cookie', cookies);

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});

    // Persistência
    const product = await ProductModel.findOne({
      _id: productId,
    });

    expect(product).toBeNull();
  });

  // ------------------------
  // celebrateForAccessToken
  // ------------------------

  // 2
  it('Exige accessToken', async () => {
    const error = await request.delete(`/admin/menu/${productId}`);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 3
  it('accessToken fora do padrão JWT', async () => {
    const error = await request
      .delete(`/admin/menu/${productId}`)
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

  // 4'
  it('accessToken expirado', async () => {
    const expiredToken = jwt.sign(
      { _id: '123', role: 'admin' },
      env.JWT_SECRET,
      { expiresIn: '-1s' }, // token é gerado já expirado
    );

    const error = await request
      .delete(`/admin/menu/${productId}`)
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
      .delete(`/admin/menu/${productId}`)
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
    const error = await request
      .delete(`/admin/menu/${productId}`)
      .set('Cookie', cookies);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(403);

    expect(error.body.message).toBe(
      `${errorsMessages.forbidden} Acesso negado.`,
    );
  });

  // --------------------------
  // celebrateForDeleteProduct
  // --------------------------

  // 7
  it('Bloqueia productId inválido', async () => {
    const invalidProductId = '2'.repeat(23);

    const error = await request
      .delete(`/admin/menu/${invalidProductId}`)
      .set('Cookie', cookies);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------------
  // 404
  // --------------------------

  // 8
  it('Retorna 404 para produto inexistente', async () => {
    const fakeId = '2'.repeat(24);

    const error = await request
      .delete(`/admin/menu/${fakeId}`)
      .set('Cookie', cookies);

    expect(error.statusCode).toBe(404);
    expect(error.body.message).toBe(
      `${errorsMessages.notFound} Erro ao remover produto: item não encontrado.`,
    );
  });
});
