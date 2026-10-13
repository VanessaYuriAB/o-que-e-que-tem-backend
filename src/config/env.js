import dotenv from 'dotenv';
import ConfigError from '../shared/errors/ConfigError.js';
import errorsMessages from '../shared/utils/errorsMessages.js';
import validateEnv from './validateEnv.js';
import logger from '../shared/logger/logger.js';

// ---------------------
// Dotenv (carregamento)
// ---------------------

// Valida NODE_ENV existe
if (!process.env.NODE_ENV) {
  throw new ConfigError(
    `${errorsMessages.config} NODE_ENV não definido. Utilize os scripts do package.json.`,
  );
}

// Configura leitura do arquivo dinamicamente, de acordo com o ambiente, carregando o .env correspondente
const resultEnv = dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

// Log sobre .env, apenas em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  if (resultEnv.error) {
    logger.warn(`Nenhum arquivo .env.${process.env.NODE_ENV} encontrado`);
  } else {
    logger.info(`Arquivo env carregado: .env.${process.env.NODE_ENV}`);
  }
}

// Valida envs (obrigatórias)
validateEnv(process.env);

// -------------------------
// Exportação das variáveis
// -------------------------

const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: Number(process.env.PORT),
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: process.env.DB_NAME,
  CORS_ORIGIN: process.env.CORS_ORIGIN?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX),
  JWT_SECRET: process.env.JWT_SECRET,
};

export default env;
