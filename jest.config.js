export default {
  testEnvironment: 'node',

  testMatch: ['**/tests/**/*.test.js'],

  collectCoverageFrom: [
    'src/**/*.js',

    '!src/**/logger.js',
    '!src/**/requestLogger.js',
    '!src/**/errorLogger.js',
  ],

  // Configuração para rodar testes com banco de dados
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],
};
