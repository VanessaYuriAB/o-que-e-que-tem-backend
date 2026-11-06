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
const { default: sendUserMsgNotificationToAdmin } =
  await import('../../../src/modules/contact/contact.service.js');

// Testes unitários > sendUserMsgNotificationToAdmin() com sendEmail mockado e logger mockado
// sendUserMsgNotificationToAdmin() > monta o e-mail corretamente > chama sendEmail() > trata falhas > loga erro quando necessário

describe('sendUserMsgNotificationToAdmin', () => {
  // Limpeza do mock (acúmulo de chamadas)
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1
  it('Deve enviar notificação ao administrador', async () => {
    sendEmail.mockResolvedValue({
      id: 'abc123',
    });

    await sendUserMsgNotificationToAdmin({
      userName: 'Vanessa',
      email: 'email@teste.com',
      whatsapp: '(11) 98765-4321',
      message: 'Olá',
      method: 'email',
    });

    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(logger.error).not.toHaveBeenCalled();
  });

  // 2
  it('Deve registrar erro quando sendEmail falhar', async () => {
    sendEmail.mockRejectedValue(new Error('Erro Resend'));

    await sendUserMsgNotificationToAdmin({
      userName: 'Vanessa',
      email: 'email@teste.com',
      whatsapp: '(11) 98765-4321',
      message: 'Olá',
      method: 'email',
    });

    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
