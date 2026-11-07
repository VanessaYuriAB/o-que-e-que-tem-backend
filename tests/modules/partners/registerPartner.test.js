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
import PartnerModel from '../../../src/modules/partners/partner.model.js';
import errorsMessages from '../../../src/shared/utils/errorsMessages.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de cadastro de mercado parceiro + envio de e-mail de notificação ao admin
// requisição HTTP > validateContentType > celebrateForRegisterPartner > registerPartner > DB > Service (com email.service mockado)

describe('Register Partner Flow > POST "/partners"', () => {
  // --------
  // Payload
  // --------

  const partnerPayload = {
    userName: 'Nome do dono no mercado parceiro',
    email: 'email@mercadoparceiro.com',
    tel: '(11) 98765-4321',

    contactMethod: 'email',

    companyName: 'Nome do mercado parceiro',
    cnpj: '00.000.000/0000-00',
    cep: '00000-000',
    address: 'Endereço do mercado',
    numberAddress: '987',
    complementAddress: 'Loja 123',
    district: 'Bairro do mercado',
  };

  // -------
  // Válido
  // -------

  // 1
  it('Cadastro de parceria bem sucedido + persistência + acionamento do serviço de notificação', async () => {
    // Cadastro
    const res = await request.post('/partners').send(partnerPayload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    expect(res.body).toMatchObject({
      userName: partnerPayload.userName,
      email: partnerPayload.email,
      tel: partnerPayload.tel,

      contactMethod: partnerPayload.contactMethod,

      companyName: partnerPayload.companyName,
      cnpj: partnerPayload.cnpj,
      cep: partnerPayload.cep,
      address: partnerPayload.address,
      numberAddress: partnerPayload.numberAddress,
      complementAddress: partnerPayload.complementAddress,
      district: partnerPayload.district,

      _id: expect.stringMatching(/^[0-9a-fA-F]{24}$/), // formato de ObjectId do Mongo DB
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    // Notificação
    expect(sendEmail).toHaveBeenCalledTimes(1);

    expect(sendEmail).toHaveBeenCalledWith(
      expect.any(String), // emailTo
      'Nova inscrição de parceria recebida', // emailSubject
      expect.any(String), // emailHtml
    );

    // Persistência
    const partner = await PartnerModel.findOne({
      cnpj: partnerPayload.cnpj,
    });

    expect(partner).not.toBeNull();

    expect(partner.userName).toBe(partnerPayload.userName);
    expect(partner.email).toBe(partnerPayload.email);
    expect(partner.tel).toBe(partnerPayload.tel);

    expect(partner.contactMethod).toBe(partnerPayload.contactMethod);

    expect(partner.companyName).toBe(partnerPayload.companyName);
    expect(partner.cnpj).toBe(partnerPayload.cnpj);

    expect(partner.cep).toBe(partnerPayload.cep);

    expect(partner.address).toBe(partnerPayload.address);
    expect(partner.numberAddress).toBe(partnerPayload.numberAddress);
    expect(partner.complementAddress).toBe(partnerPayload.complementAddress);
    expect(partner.district).toBe(partnerPayload.district);

    expect(partner._id).toBeDefined();
    expect(partner.createdAt).toBeDefined();
    expect(partner.updatedAt).toBeDefined();
  });

  // --------------------
  // validateContentType
  // --------------------

  // 2
  it('Content-Type inválido', async () => {
    const error = await request
      .post('/partners')
      .set('Content-Type', 'text/plain')
      .send('teste de header content-type');

    // pq com '.send(partnerPayload)', o Supertest envia JSON automaticamente, adicionando 'Content-Type: application/json' implicitamente

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(415);

    expect(error.body.message).toBe(
      `${errorsMessages.unsupportedMediaType} Content-Type deve ser application/json.`,
    );
  });

  // ---------------------------------------
  // celebrateForRegisterPartner (required)
  // ---------------------------------------

  // 3
  it('Exige userName', async () => {
    const payload = { ...partnerPayload };

    delete payload.userName;

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 4
  it('Exige email', async () => {
    const payload = { ...partnerPayload };

    delete payload.email;

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 5
  it('Exige tel', async () => {
    const payload = { ...partnerPayload };

    delete payload.tel;

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 6
  it('Exige companyName', async () => {
    const payload = { ...partnerPayload };

    delete payload.companyName;

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 7
  it('Exige cnpj', async () => {
    const payload = { ...partnerPayload };

    delete payload.cnpj;

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 8
  it('Exige cep', async () => {
    const payload = { ...partnerPayload };

    delete payload.cep;

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ---------------------------------------
  // celebrateForRegisterPartner (userName)
  // ---------------------------------------

  // 9
  it('userName deve conter, no mínimo, 2 caracteres', async () => {
    const payload = { ...partnerPayload, userName: 'N' };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 10
  it('userName deve conter, no máximo, 40 caracteres', async () => {
    const payload = { ...partnerPayload, userName: 'N'.repeat(41) };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 11
  it('userName deve rejeitar os caracteres HTML básicos (< e >)', async () => {
    const payload = { ...partnerPayload, userName: '<Nome do usuário>' };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ------------------------------------
  // celebrateForRegisterPartner (email)
  // ------------------------------------

  // 12
  it('email deve deve ser um e-mail válido', async () => {
    const payload = { ...partnerPayload, email: 'email-invalido' };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ----------------------------------
  // celebrateForRegisterPartner (tel)
  // ----------------------------------

  // 13
  it('tel deve seguir estrutura padronizada: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX', async () => {
    const payload = { ...partnerPayload, tel: '11 987654321' };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 14
  it('tel deve conter, no mínimo, 14 caracteres', async () => {
    const payload = { ...partnerPayload, tel: '9'.repeat(13) };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 15
  it('tel deve conter, no máximo, 15 caracteres', async () => {
    const payload = { ...partnerPayload, tel: '9'.repeat(16) };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------------------------------
  // celebrateForRegisterPartner (contactMethod)
  // --------------------------------------------

  // 16
  it('contactMethod deve rejeitar valores não definidos', async () => {
    const payload = {
      ...partnerPayload,
      contactMethod: 'whatsapp',
    };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ------------------------------------------
  // celebrateForRegisterPartner (companyName)
  // ------------------------------------------

  // 17
  it('companyName deve rejeitar os caracteres HTML básicos (< e >)', async () => {
    const payload = {
      ...partnerPayload,
      companyName: '<Mercado Parceiro>',
    };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -----------------------------------
  // celebrateForRegisterPartner (cnpj)
  // -----------------------------------

  // 18
  it('cnpj deve conter, no mínimo, 14 caracteres', async () => {
    const payload = {
      ...partnerPayload,
      cnpj: '1'.repeat(13),
    };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 19
  it('cnpj deve conter, no máximo, 18 caracteres', async () => {
    const payload = {
      ...partnerPayload,
      cnpj: '1'.repeat(19),
    };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 20
  it('cnpj deve seguir um dos formatos aceitos, AA.AAA.AAA/AAAA-XX ou AAAAAAAAAAAAXX', async () => {
    const payload = {
      ...partnerPayload,
      cnpj: '11111111/1111-11',
    };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // -----------------------------------
  // celebrateForRegisterPartner (cep)
  // -----------------------------------

  // 21
  it('cep deve conter, no mínimo, 8 caracteres', async () => {
    const payload = {
      ...partnerPayload,
      cep: '1'.repeat(7),
    };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 22
  it('cep deve conter, no máximo, 9 caracteres', async () => {
    const payload = {
      ...partnerPayload,
      cep: '1'.repeat(10),
    };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // 23
  it('cep deve seguir os formatos XXXXXXXX ou XXXXX-XXX', async () => {
    const payload = {
      ...partnerPayload,
      cep: 'ABCDE-XYZ',
    };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------------------------
  // celebrateForRegisterPartner (address)
  // --------------------------------------

  // 24
  it('address deve rejeitar os caracteres HTML básicos (< e >)', async () => {
    const payload = {
      ...partnerPayload,
      address: '<Rua Principal>',
    };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------------------------------
  // celebrateForRegisterPartner (numberAddress)
  // --------------------------------------------

  // 25
  it('numberAddress deve aceitar apenas letras, números e espaços', async () => {
    const payload = {
      ...partnerPayload,
      numberAddress: '123@',
    };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ------------------------------------------------
  // celebrateForRegisterPartner (complementAddress)
  // ------------------------------------------------

  // 26
  it('complementAddress deve aceitar apenas letras, números, espaços, pontos e traços', async () => {
    const payload = {
      ...partnerPayload,
      complementAddress: 'Loja@123',
    };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // ---------------------------------------
  // celebrateForRegisterPartner (district)
  // ---------------------------------------

  // 27
  it('district deve aceitar apenas letras, números e espaços', async () => {
    const payload = {
      ...partnerPayload,
      district: 'Centro@',
    };

    const error = await request.post('/partners').send(payload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(400);

    expect(error.body).toMatchObject({
      message: expect.stringMatching('Validation failed'),
    });
  });

  // --------------------
  // ConflictError (409)
  // --------------------

  // 28
  it('cnpj duplicado', async () => {
    // Cria seed (201)
    const res = await request.post('/partners').send(partnerPayload);

    expect(res.type).toMatch(/json/);
    expect(res.statusCode).toBe(201);

    // Envia o mesmo cadastro (409)
    const error = await request.post('/partners').send(partnerPayload);

    expect(error.type).toMatch(/json/);
    expect(error.statusCode).toBe(409);

    expect(error.body).toHaveProperty('message');
    expect(error.body.message).toBe(
      `${errorsMessages.conflict} CNPJ duplicado.`,
    );
  });
});
