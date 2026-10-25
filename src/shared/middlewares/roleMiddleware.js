import ForbiddenError from '../errors/ForbiddenError.js';
import errorsMessages from '../utils/errorsMessages.js';

// --------------------------
// Middleware de autorização
// --------------------------

// RBAC: Controle de acesso baseado em papéis (roles)
// Valida autorização de acesso, baseado em usuário/admin
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(`${errorsMessages.forbidden} Acesso negado.`);
    }

    next();
  };
};

export default roleMiddleware;
