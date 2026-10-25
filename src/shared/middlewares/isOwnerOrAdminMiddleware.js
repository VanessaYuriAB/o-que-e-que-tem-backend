import ForbiddenError from '../errors/ForbiddenError.js';
import errorsMessages from '../utils/errorsMessages.js';

// --------------------------
// Middleware de autorização
// --------------------------

// Autorização por proprietário ("owner access")
// Validação baseada em id e req.params
const isOwnerOrAdminMiddleware = (paramName = 'id') => {
  return (req, res, next) => {
    if (req.user.role === 'admin') {
      return next();
    }

    if (req.user._id === req.params[paramName]) {
      return next();
    }

    throw new ForbiddenError(`${errorsMessages.forbidden} Acesso negado.`);
  };
};

export default isOwnerOrAdminMiddleware;
