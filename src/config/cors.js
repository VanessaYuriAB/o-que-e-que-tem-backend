import ForbiddenError from '../shared/errors/ForbiddenError.js';
import errorsMessages from '../shared/utils/errorsMessages.js';

const allowedCors = process.env.CORS_ORIGIN.split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Cabeçalho HTTP Origin não enviado, é undefined (para requisições Postman, Curl, apps mobile, alguns testes automatizados) > Permite requisições sem header Origin
    if (!origin) {
      return callback(null, true);
    }

    if (allowedCors.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new ForbiddenError(
        `${errorsMessages.forbidden} Origem bloqueada pelo CORS: ${origin}.`,
      ),
    );
  },

  credentials: true,
};

export default corsOptions;
