import jwt from 'jsonwebtoken';
import UnauthorizedError from '../../shared/errors/UnauthorizedError.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';
import env from '../../config/env.js';

const authMiddleware = (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    throw new UnauthorizedError(
      `${errorsMessages.unauthorized} Erro na autenticação do usuário: accessToken não fornecido.`,
    );
  }

  try {
    const payload = jwt.verify(accessToken, env.JWT_SECRET);

    req.user = payload;

    next();
  } catch {
    throw new UnauthorizedError(
      `${errorsMessages.unauthorized} Erro na autenticação do usuário: accessToken inválido.`,
    );
  }
};

export default authMiddleware;
