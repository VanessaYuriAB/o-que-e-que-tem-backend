import sendEmail from '../../shared/services/email.service.js';
import env from '../../config/env.js';
import logger from '../../shared/logger/logger.js';

const sendUserMsgNotificationToAdmin = async (msgData) => {
  try {
    const resultData = await sendEmail(
      env.ADMIN_EMAIL,
      'Nova mensagem de usuário recebida',
      `
      <h2>Nova mensagem de usuário</h2>

      <p><strong>Nome:</strong> ${msgData.userName}</p>
      <p><strong>Email:</strong> ${msgData.email}</p>
      <p><strong>WhatsApp:</strong> ${msgData.whatsapp}</p>
      <p><strong>Método preferido:</strong> ${msgData.method}</p>

      <hr>

      <p>${msgData.message}</p>
    `,
    );

    logger.info('Notificação enviada ao admin (nova mensagem de usuário)', {
      emailId: resultData.id,

      email: msgData.email,
      userName: msgData.userName,
    });
  } catch (error) {
    logger.error({
      message:
        'Falha ao enviar notificação ao admin (nova mensagem de usuário)',

      error: error.message,
      stack: error.stack,

      email: msgData.email,
      userName: msgData.userName,
    });
  }
};

export default sendUserMsgNotificationToAdmin;
