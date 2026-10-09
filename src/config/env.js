import ConfigError from '../shared/errors/ConfigError.js';
import errorsMessages from '../shared/utils/errorsMessages.js';

// --------
// Dotenv
// --------

// Carrega dotenv
import dotenv from 'dotenv';

// Valida NODE_ENV existe
if (!process.env.NODE_ENV) {
  throw new ConfigError(errorsMessages.noNodeEnv);
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

// Carrega utilitário (verifyEnv)
import verifyEnv from '../shared/utils/verifyEnv.js';

// Valida envs (obrigatórias)
verifyEnv();
