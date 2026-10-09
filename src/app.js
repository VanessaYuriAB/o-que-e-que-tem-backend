// --------------------
// Importações do app
// --------------------

import express from 'express';

// --------
// Express
// --------

const app = express();

// ------------
// Body-parser
// ------------

app.use(express.json());

// Exporta app, para uso em server.js e no Supertest
export default app;
