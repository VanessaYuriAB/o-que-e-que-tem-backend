import dotenv from 'dotenv';
import ConfigError from '../shared/errors/ConfigError.js';
import errorsMessages from '../shared/utils/errorsMessages.js';
import verifyEnv from '../shared/utils/verifyEnv.js';

// --------
// Dotenv
// --------

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
    console.warn(`Nenhum arquivo .env.${process.env.NODE_ENV} encontrado`);
  } else {
    console.info(`Arquivo env carregado: .env.${process.env.NODE_ENV}`);
  }
}

// Valida envs (obrigatórias)
verifyEnv();
