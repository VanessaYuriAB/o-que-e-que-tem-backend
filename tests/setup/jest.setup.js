// Setup global do Mongoose: para testes com banco de dados
// Inicializa ambiente de testes de integração com MongoDB real

import connectDb from '../../src/config/database.js';
import mongoose from 'mongoose';

// Conecta ao DB sem iniciar porta HTTP, antes de rodar testes
beforeAll(async () => {
  await connectDb();
});

// Desconecta do banco de dados após rodar todos os testes
afterAll(async () => {
  await mongoose.disconnect();
});
