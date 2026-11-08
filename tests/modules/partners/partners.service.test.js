import { jest } from '@jest/globals';

jest.unstable_mockModule(
  '../../../src/shared/services/email.service.js',
  () => ({
    default: jest.fn(),
  }),
);

jest.unstable_mockModule('../../../src/shared/logger/logger.js', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const { default: sendEmail } =
  await import('../../../src/shared/services/email.service.js');
const { default: logger } =
  await import('../../../src/shared/logger/logger.js');
const { default: sendNewPartnerNotificationToAdmin } =
  await import('../../../src/modules/partners/partners.service.js');

// Testes unitários > sendNewPartnerNotificationToAdmin() com sendEmail mockado e logger mockado
// sendNewPartnerNotificationToAdmin() > monta o e-mail corretamente > chama sendEmail() > trata falhas > loga erro quando necessário

describe('sendNewPartnerNotificationToAdmin', () => {
  // Limpeza do mock (acúmulo de chamadas)
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const newPartnerPayload = {
    userName: 'Vanessa',
    email: 'email@teste.com',
    tel: '(11) 98765-4321',

    contactMethod: 'email',

    companyName: 'Mercado tal',
    cnpj: '00.000.000/0000-00',
    cep: '00000-000',

    address: 'Endereço do mercado',
    numberAddress: '987',
    complementAddress: 'Loja 123',
    district: 'Bairro do mercado',
  };

  // 1
  it('Deve enviar notificação ao administrador', async () => {
    sendEmail.mockResolvedValue({
      id: 'abc123',
    });

    await sendNewPartnerNotificationToAdmin(newPartnerPayload);

    expect(sendEmail).toHaveBeenCalledTimes(1);

    expect(sendEmail).toHaveBeenCalledWith(
      expect.any(String),
      'Nova inscrição de parceria recebida',
      expect.stringContaining(newPartnerPayload.companyName),
    );

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.error).not.toHaveBeenCalled();

    expect(logger.info).toHaveBeenCalledWith(
      'Notificação enviada ao admin (novo mercado parceiro)',
      expect.objectContaining({
        email: newPartnerPayload.email,
        userName: newPartnerPayload.userName,
        companyName: newPartnerPayload.companyName,
      }),
    );
  });

  // 2
  it('Deve registrar erro quando sendEmail falhar', async () => {
    sendEmail.mockRejectedValue(new Error('Erro Resend'));

    await sendNewPartnerNotificationToAdmin(newPartnerPayload);

    expect(logger.error).toHaveBeenCalledTimes(1);

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Falha ao enviar notificação ao admin (novo mercado parceiro)',
        email: newPartnerPayload.email,
        userName: newPartnerPayload.userName,
        companyName: newPartnerPayload.companyName,
      }),
    );

    expect(logger.info).not.toHaveBeenCalled();
  });
});
