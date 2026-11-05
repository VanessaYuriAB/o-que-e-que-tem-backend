import { Resend } from 'resend';
import env from '../../config/env.js';
import logger from '../logger/logger.js';

const resend = new Resend(env.RESEND_API_KEY);

const sendEmail = async (emailTo, emailSubject, emailHtml) => {
  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: emailTo,
    subject: emailSubject,

    html: emailHtml,
  });

  if (error) {
    throw new Error(error.message);
  }

  logger.info('Resposta de sucesso do Resend', data);

  return data;
};

export default sendEmail;
