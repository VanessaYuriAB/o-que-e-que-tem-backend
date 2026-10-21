// --------------------
// Importações do app
// --------------------

import express from 'express';
import errorHandler from './shared/middlewares/errorHandler.js';
import notFoundPage from './shared/middlewares/notFoundPage.js';
import { errors } from 'celebrate';
import cors from 'cors';
import corsOptions from './config/cors.js';
import helmet from 'helmet';
import limiter from './shared/middlewares/limiter.js';
import requestLogger from './shared/middlewares/requestLogger.js';
import errorLogger from './shared/middlewares/errorLogger.js';
import env from './config/env.js';
import cookieParser from 'cookie-parser';
import modules from './routes/index.js';

// --------
// Express
// --------

const app = express();

// ------
// CORS
// ------

// Aplica CORS com opções específicas
app.use(cors(corsOptions));

// Trata requisições preflight (OPTIONS)
app.options(/.*/, cors(corsOptions));

// -------
// Helmet
// -------

// Depois do CORS

// Backend REST, muitas diretivas não têm efeito prático porque a API não entrega páginas HTML; usando Helmet padrão, CSP configurado no frontend (React/Vite) - connectSrc é a diretiva mais útil (interface web servida pelo mesmo servidor)
app.use(helmet());

// -----------
// Rate limit
// -----------

// Depois do CORS, para não bloquear preflight

app.use(limiter);

// ------------
// Body-parser
// ------------

app.use(express.json());

// --------------
// Cookie-parser
// --------------

app.use(cookieParser());

// ----------------
// Logs (requests)
// ----------------

app.use(requestLogger);

// -------
// Rotas
// -------

// Rota teste para ambiente de desenvolvimento
if (env.NODE_ENV === 'development') {
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
}

// Agregador de módulos: rotas da aplicação
modules.forEach(({ path, router }) => {
  app.use(path, router);
});

// --------------------
// Tratamento de erros
// --------------------

// Rota não encontrada (404)
app.use(notFoundPage);

// Erros do Celebrate/Joi
app.use(errors());

// Log de erros
app.use(errorLogger);

// Tratamento de erros centralizado
app.use(errorHandler);

// Exporta app, para uso em server.js e no Supertest
export default app;
