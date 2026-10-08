import ConfigError from '../errors/ConfigError.js';
import errorsMessages from './errorsMessages.js';

// Todas as variáveis obrigatórias devem estar definidas, em qualquer ambiente
const verifyEnv = () => {
  // Valida NODE_ENV permitido
  const allowedNodeEnvs = ['development', 'test', 'production'];

  if (!allowedNodeEnvs.includes(process.env.NODE_ENV)) {
    throw new ConfigError(
      `${errorsMessages.nodeEnv} Atual: ${process.env.NODE_ENV}`,
    );
  }

  // Valida todas as envs obrigatórias
  const requiredEnvVars = [
    'PORT',
    'MONGODB_URI',
    'DB_NAME',
    'CORS_ORIGIN',
    'JWT_SECRET',
    'CSP_CONNECT_SRC',
    'RATE_LIMIT_MAX',
  ];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      throw new ConfigError(`${varName} ${errorsMessages.config}`);
    }
  }
};

export default verifyEnv;
