import ConfigError from '../shared/errors/ConfigError.js';
import errorsMessages from '../shared/utils/errorsMessages.js';

// Todas as variáveis obrigatórias devem estar definidas, em qualquer ambiente
const validateEnv = (envs) => {
  // Valida NODE_ENV permitido
  const allowedNodeEnvs = ['development', 'test', 'production'];

  if (!allowedNodeEnvs.includes(envs.NODE_ENV)) {
    throw new ConfigError(
      `${errorsMessages.config} NODE_ENV inválido, verifique a definição no script utilizado. Valor atual: ${envs.NODE_ENV}. NODE_ENV deve ser development, test ou production.`,
    );
  }

  // Valida todas as envs obrigatórias
  const requiredEnvVars = [
    'PORT',
    'MONGODB_URI',
    'DB_NAME',
    'CORS_ORIGIN',
    'JWT_SECRET',
    'RATE_LIMIT_MAX',
  ];

  for (const varName of requiredEnvVars) {
    if (!envs[varName]) {
      throw new ConfigError(
        `${errorsMessages.config} ${varName} é uma variável obrigatória, é preciso defini-la no arquivo .env.`,
      );
    }
  }
};

export default validateEnv;
