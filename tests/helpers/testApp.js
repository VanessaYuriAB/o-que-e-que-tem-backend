import express from 'express';
import testRouter from '../routes/testRoutes.js';
import errorHandler from '../../src/shared/middlewares/errorHandler.js';
import rateLimit from 'express-rate-limit';
import RateLimitError from '../../src/shared/errors/RateLimitError.js';
import errorsMessages from '../../src/shared/utils/errorsMessages.js';

// App mínimo próprio para testes de integração de infraestrutura (errorHandler + limiter)
// Utilizado para validar middlewares e fluxos isolados do Express, sem depender da configuração completa da aplicação
// Rota / Middleware -> next(error) -> errorHandler

const testApp = express();

// Rate limiting
testApp.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    standardHeaders: true,
    legacyHeaders: false,

    handler(req, res, next) {
      next(
        new RateLimitError(
          `${errorsMessages.rateLimit} Tente novamente em 15 minutos.`,
        ),
      );
    },
  }),
);

testApp.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

// Rotas auxiliares para propagação de erros
testApp.use('/test-errors', testRouter);

// Middleware de erro
testApp.use(errorHandler);

export default testApp;
