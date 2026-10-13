import NotFoundError from '../errors/NotFoundError.js';
import errorsMessages from '../utils/errorsMessages.js';

// Middleware de tratamento de erros para rotas não encontradas: erro 404
const notFoundPage = (req, res, next) => {
  next(
    new NotFoundError(
      `${errorsMessages.notFound} A página não foi encontrada, é um endereço inexistente.`,
    ),
  );
};

export default notFoundPage;
