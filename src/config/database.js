import mongoose from 'mongoose';
import env from './env.js';
import logger from '../shared/logger/logger.js';

// -----------------
// Banco de dados
// -----------------

const connectDb = async () => {
  await mongoose.connect(`${env.MONGODB_URI}/${env.DB_NAME}`);

  logger.info(`MongoDB conectado: ${mongoose.connection.name}`);
};

export default connectDb;
