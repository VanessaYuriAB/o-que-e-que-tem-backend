import jwt from 'jsonwebtoken';
import UnauthorizedError from '../../shared/errors/UnauthorizedError.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';
import env from '../../config/env.js';
import ForbiddenError from '../../shared/errors/ForbiddenError.js';

// ---------------------------------------------------------------------------------------
// Middlewares de autenticação
// Validações criptográficas dos cookies de autenticação JWT (accessToken + refreshToken)
// Validam assinatura/expiração dos tokens + propagação do payload em req.user
// ---------------------------------------------------------------------------------------

const accessMiddleware = (req, res, next) => {
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

const refreshMiddleware = (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new UnauthorizedError(
      `${errorsMessages.unauthorized} Erro na recuperação da sessão do usuário: refreshToken não fornecido.`,
    );
  }

  try {
    req.user = jwt.verify(refreshToken, env.JWT_SECRET);

    next();
  } catch {
    throw new UnauthorizedError(
      `${errorsMessages.unauthorized} Erro na recuperação da sessão do usuário: refreshToken inválido.`,
    );
  }
};

// --------------------------------------------------------
// Middlware de autorização
// RBAC: Controle de acesso baseado em papéis (roles)
// Valida autorização de acesso, baseado em usuário/admin
// --------------------------------------------------------

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(`${errorsMessages.forbidden} Acesso negado.`);
    }

    next();
  };
};

export { accessMiddleware, refreshMiddleware, roleMiddleware };
