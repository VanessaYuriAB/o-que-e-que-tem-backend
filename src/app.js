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
