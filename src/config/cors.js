import env from './env.js';
import ForbiddenError from '../shared/errors/ForbiddenError.js';
import errorsMessages from '../shared/utils/errorsMessages.js';

const corsOptions = {
  origin: (origin, callback) => {
    // Cabeçalho HTTP Origin não enviado, é undefined (para requisições Postman, Curl, apps mobile, alguns testes automatizados) > Permite requisições sem header Origin
    if (!origin) {
      return callback(null, true);
    }

    if (env.CORS_ORIGIN.includes(origin)) {
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
