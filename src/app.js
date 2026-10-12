// --------------------
// Importações do app
// --------------------

import express from 'express';
import errorHandler from './shared/middlewares/errorHandler.js';
import notFoundPage from './shared/middlewares/notFoundPage.js';
import { errors } from 'celebrate';

// --------
// Express
// --------

const app = express();

// ------------
// Body-parser
// ------------

app.use(express.json());

// --------------------
// Tratamento de erros
// --------------------

// Rota não encontrada (404)
app.use(notFoundPage);

// Erros do Celebrate/Joi
app.use(errors());

// Tratamento de erros centralizado
app.use(errorHandler);

// Exporta app, para uso em server.js e no Supertest
export default app;
