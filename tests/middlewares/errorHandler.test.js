// Supertest
import supertest from 'supertest';
// Jest
import { jest } from '@jest/globals';
// Express test service
import testApp from '../helpers/testApp.js';
// Mongoose
import mongoose from 'mongoose';
// Utils
import errorsMessages from '../../src/shared/utils/errorsMessages.js';
import errorHandler from '../../src/shared/middlewares/errorHandler.js';
import ConfigError from '../../src/shared/errors/ConfigError.js';
import ConflictError from '../../src/shared/errors/ConflictError.js';
import ForbiddenError from '../../src/shared/errors/ForbiddenError.js';
import NotFoundError from '../../src/shared/errors/NotFoundError.js';
import RateLimitError from '../../src/shared/errors/RateLimitError.js';
import UnauthorizedError from '../../src/shared/errors/UnauthorizedError.js';

// Request to test
const request = supertest(testApp);

// Helpers
const createMocks = () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  const next = jest.fn();

  return { req, res, next };
};

const executeMiddleware = (error) => {
  const { req, res, next } = createMocks();

  errorHandler(error, req, res, next);

  return res;
};

// Testes unitários
// Error > errorHandler > res.status() / res.send()
// Testa apenas a responsabilidade do middleware: status HTTP e mensagem corretos

describe('errorHandler - unit', () => {
  // 1
  it('deve retornar 500 para ConfigError', () => {
    const error = new ConfigError(errorsMessages.config);

    const res = executeMiddleware(error);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: errorsMessages.config,
    });
  });

  // 2
  it('deve retornar 409 para ConflictError', () => {
    const error = new ConflictError(errorsMessages.conflict);

    const res = executeMiddleware(error);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith({
      message: errorsMessages.conflict,
    });
  });

  // 3
  it('deve retornar 403 para ForbiddenError', () => {
    const error = new ForbiddenError(errorsMessages.forbidden);

    const res = executeMiddleware(error);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({
      message: errorsMessages.forbidden,
    });
  });

  // 4
  it('deve retornar 404 para NotFoundError', () => {
    const error = new NotFoundError(errorsMessages.notFound);

    const res = executeMiddleware(error);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      message: errorsMessages.notFound,
    });
  });

  // 5
  it('deve retornar 429 para RateLimitError', () => {
    const error = new RateLimitError(errorsMessages.rateLimit);

    const res = executeMiddleware(error);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.send).toHaveBeenCalledWith({
      message: errorsMessages.rateLimit,
    });
  });

  // 6
  it('deve retornar 401 para UnauthorizedError', () => {
    const error = new UnauthorizedError(errorsMessages.unauthorized);

    const res = executeMiddleware(error);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      message: errorsMessages.unauthorized,
    });
  });

  // 7
  it('deve retornar 400 para erros de conversão (Cast Error) do Mongoose (Bad Request)', () => {
    const error = new mongoose.Error.CastError('ObjectId', 'abc', '_id');

    // 'ObjectId': tipo esperado (kind)
    // 'abc': valor recebido (value)
    // '_id': campo onde ocorreu o erro (path)

    const res = executeMiddleware(error);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: '_id inválido ou incompleto',
    });
  });

  // 8
  it('deve retornar 400 para erros de validação (Validation Error) do Mongoose (Bad Request)', () => {
    const error = new mongoose.Error.ValidationError();

    const res = executeMiddleware(error);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Dado(s) inválido(s) ou inexistente(s)',
    });
  });
});

// Testes de integração
// Request HTTP > Express > Rota, next(error) > Error > errorHandler > Response HTTP
// Testa o fluxo completo para validar que o Express realmente chega até o middleware

describe('errorHandler - integration', () => {
  // 1
  it('deve propagar ConflictError até o errorHandler', async () => {
    const response = await request.get('/test-errors/conflict');

    expect(response.type).toMatch(/json/);
    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(errorsMessages.conflict);
  });

  // 2
  it('deve propagar ForbiddenError até o errorHandler', async () => {
    const response = await request.get('/test-errors/forbidden');

    expect(response.type).toMatch(/json/);
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(errorsMessages.forbidden);
  });

  // 3
  it('deve propagar CastError até o errorHandler', async () => {
    const response = await request.get('/test-errors/cast');

    expect(response.type).toMatch(/json/);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('_id inválido ou incompleto');
  });

  // 4
  it('deve propagar ValidationError até o errorHandler', async () => {
    const response = await request.get('/test-errors/validation');

    expect(response.type).toMatch(/json/);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Dado(s) inválido(s) ou inexistente(s)');
  });
});
