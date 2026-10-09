// --------------------
// Importações do app
// --------------------

import express from 'express';
import errorHandler from './shared/middlewares/errorHandler.js';

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

app.use(errorHandler);

// Exporta app, para uso em server.js e no Supertest
export default app;
