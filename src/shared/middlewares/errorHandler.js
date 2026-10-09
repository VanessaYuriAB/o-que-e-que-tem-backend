import mongoose from 'mongoose';

// Captura apenas erros que podem ocorrer após o Express começar a processar requisições (request lifecycle), depois que o servidor já está rodando > erros de inicialização (startup) não são processados pelo middleware (ConfigError)

const errorHandler = (err, req, res, next) => {
  // ----------------------------------------------------------------
  // Erros da infraestrutura/framework gerados pelo próprio Mongoose,
  // traduzidos para respostas HTTP adequadas
  // ----------------------------------------------------------------

  // Erros de conversão ou validação do Mongoose → Bad Request
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).send({ message: '_id inválido ou incompleto' });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res
      .status(400)
      .send({ message: 'Dado(s) inválido(s) ou inexistente(s)' });
  }

  // --------------------------------------------------
  // Erros de domínio, representam regras da aplicação
  // --------------------------------------------------

  // Erros customizados usam statusCode definido na própria classe ou 500
  const { statusCode = 500, message = 'Ocorreu um erro no servidor' } = err;

  return res.status(statusCode).send({ message });
};

export default errorHandler;
