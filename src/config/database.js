import mongoose from 'mongoose';
import logger from '../shared/logger/logger.js';

// -----------------
// Banco de dados
// -----------------

const connectDb = async () => {
  await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

  logger.info(`MongoDB conectado: ${mongoose.connection.name}`);
};

export default connectDb;
