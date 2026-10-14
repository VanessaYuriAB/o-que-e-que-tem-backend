export default {
  testEnvironment: 'node',

  testMatch: ['**/tests/**/*.test.js'],

  collectCoverageFrom: [
    'src/**/*.js',

    '!src/**/logger.js',
    '!src/**/requestLogger.js',
    '!src/**/errorLogger.js',
  ],
};
