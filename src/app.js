// --------------------
// Importações do app
// --------------------

import express from 'express';
import errorHandler from './shared/middlewares/errorHandler.js';
import notFoundPage from './shared/middlewares/notFoundPage.js';

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

app.use(notFoundPage);
app.use(errorHandler);

// Exporta app, para uso em server.js e no Supertest
export default app;
