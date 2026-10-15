import express from 'express';
import testRouter from '../routes/testRoutes.js';
import errorHandler from '../../src/shared/middlewares/errorHandler.js';

// App próprio para testes de integração, com o mínimo para testes do errorHandler
// Para validar rota -> next(error) -> errorHandler

const testApp = express();

testApp.use('/test-errors', testRouter);
testApp.use(errorHandler);

export default testApp;
