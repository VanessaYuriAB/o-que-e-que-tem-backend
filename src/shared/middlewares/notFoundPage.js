import NotFoundError from '../errors/NotFoundError.js';

// Middleware de tratamento de erros para rotas não encontradas: erro 404
const notFoundPage = (req, res, next) => {
  next(
    new NotFoundError(
      'A página não foi encontrada, é um endereço inexistente.',
    ),
  );
};

export default notFoundPage;
