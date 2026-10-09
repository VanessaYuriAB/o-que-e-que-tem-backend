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

// --------------------
// Conexão com MongoDB
// --------------------

await connectDb();

// -----------
// Servidor
// -----------

// Sobe o servidor da aplicação
// Configura porta a ser ouvida, apenas se não estiver executando no modo de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT, () => {
    console.info(`Servidor rodando na porta: ${process.env.PORT}`);
  });
}
