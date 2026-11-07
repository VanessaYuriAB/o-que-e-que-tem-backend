import sendEmail from '../../shared/services/email.service.js';
import env from '../../config/env.js';
import logger from '../../shared/logger/logger.js';

const sendNewPartnerNotificationToAdmin = async (partnerData) => {
  try {
    const resultData = await sendEmail(
      env.ADMIN_EMAIL,
      'Nova inscrição de parceria recebida',
      `
      <h2>Novo mercado parceiro</h2>

      <p><strong>Nome:</strong> ${partnerData.userName}</p>
      <p><strong>Email:</strong> ${partnerData.email}</p>
      <p><strong>Telefone:</strong> ${partnerData.tel}</p>

      <hr>

      <p><strong>Método preferido:</strong> ${partnerData.contactMethod ?? 'Não informado'}</p>

      <hr>

      <p><strong>Razão Social:</strong> ${partnerData.companyName}</p>
      <p><strong>CNPJ:</strong> ${partnerData.cnpj}</p>

       <hr>

      <p><strong>CEP:</strong> ${partnerData.cep}</p>

      <p><strong>Endereço:</strong> ${partnerData.address ?? 'Não informado'}</p>
      <p><strong>Nº:</strong> ${partnerData.numberAddress ?? 'Não informado'}</p>
      <p><strong>Complemento:</strong> ${partnerData.complementAddress ?? 'Não informado'}</p>
      <p><strong>Bairro:</strong> ${partnerData.district ?? 'Não informado'}</p>
    `,
    );

    logger.info('Notificação enviada ao admin (novo mercado parceiro)', {
      emailId: resultData.id,

      email: partnerData.email,
      userName: partnerData.userName,
      companyName: partnerData.companyName,
    });
  } catch (error) {
    logger.error({
      message: 'Falha ao enviar notificação ao admin (novo mercado parceiro)',

      error: error.message,
      stack: error.stack,

      email: partnerData.email,
      userName: partnerData.userName,
      companyName: partnerData.companyName,
    });
  }
};

export default sendNewPartnerNotificationToAdmin;
