// Startup: inicializa produção/desenvolvimento

// ---------------------
// Importação do dotenv
// ---------------------

// Carrega dotenv antes de qualquer uso de process.env
import './src/config/env.js';

// ------------------------
// Importações do servidor
// ------------------------

import app from './src/app.js';
import connectDb from './src/config/database.js';
import logger from './src/shared/logger/logger.js';

// ---------------------------
// Banco de dados + Servidor
// ---------------------------

try {
  // Conexão com MongoDB
  await connectDb();

  // Sobe o servidor da aplicação
  app.listen(process.env.PORT, () => {
    logger.info(`Servidor rodando na porta: ${process.env.PORT}`);
  });
} catch (error) {
  logger.error({
    message: 'Falha ao inicializar a aplicação',
    error: error.message,
    stack: error.stack,
  });

  // Para evitar app rodando sem DB
  process.exit(1);
}
