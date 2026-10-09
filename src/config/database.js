import mongoose from 'mongoose';

// -----------------
// Banco de dados
// -----------------

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

    console.info(`MongoDB conectado: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(`Erro ao conectar com Mongo DB: ${error}`);

    // Em teste, erros devem falhar testes, não matar processos
    // Jest captura o erro, o teste falha corretamente e o stacktrace permanece completo pq o erro é lançado antes do '.exit'
    if (process.env.NODE_ENV === 'test') {
      throw error;
    }

    // Para evitar app rodando sem DB
    process.exit(1);
  }
};

export default connectDb;
