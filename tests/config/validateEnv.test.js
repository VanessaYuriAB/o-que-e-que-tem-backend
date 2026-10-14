import validateEnv from '../../src/config/validateEnv.js';
import ConfigError from '../../src/shared/errors/ConfigError.js';

// Teste unitário puro (Jest)
// Não depende de .env.test, de process.env e de dotenv; testa apenas a lógica da função isoladamente, utilizando objeto mockado

describe('validateEnv', () => {
  // 1
  it('não deve lançar erro para envs válidos', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'test',
        PORT: '3002',
        MONGODB_URI: 'mongodb://localhost:27017',
        DB_NAME: 'oqueequetemdb_test',
        CORS_ORIGIN: 'http://localhost:3000',
        JWT_SECRET: 'secret',
        RATE_LIMIT_MAX: '200',
      }),
    ).not.toThrow();
  });

  // 2
  it('deve lançar erro para NODE_ENV inválido', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'abc',
      }),
    ).toThrow(ConfigError);
  });

  // 3
  it('deve lançar erro com msg "NODE_ENV inválido" para NODE_ENV inválido', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'abc',
      }),
    ).toThrow('NODE_ENV inválido');
  });

  // 4
  it('deve lançar erro quando PORT não existir', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'test',
      }),
    ).toThrow(ConfigError);
  });

  // 5
  it('deve lançar erro com msg "PORT é uma variável obrigatória" quando PORT não existir', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'test',
      }),
    ).toThrow('PORT é uma variável obrigatória');
  });

  // 6
  it('deve lançar erro quando MONGODB_URI não existir', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'test',
        PORT: '3001',
      }),
    ).toThrow(ConfigError);
  });

  // 7
  it('deve lançar erro com msg "MONGODB_URI é uma variável obrigatória" quando MONGODB_URI não existir', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'test',
        PORT: '3002',
      }),
    ).toThrow('MONGODB_URI é uma variável obrigatória');
  });
});
