// ---------------------
// Importação do dotenv
// ---------------------

// Carrega dotenv antes de qualquer uso de process.env
import './src/config/env.js';

// ------------------------
// Importações do servidor
// ------------------------

import app from './src/app.js';

// -----------
// Servidor
// -----------

// Sobe o servidor da aplicação
// Configura porta a ser ouvida, apenas se não estiver executando no modo de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta: ${process.env.PORT}`);
  });
}
