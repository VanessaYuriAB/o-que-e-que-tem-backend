import mongoose from 'mongoose';

// -----------------
// Banco de dados
// -----------------

const connectDb = async () => {
  await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

  console.info(`MongoDB conectado: ${mongoose.connection.name}`);
};

export default connectDb;
