import UnsupportedMediaTypeError from '../errors/UnsupportedMediaTypeError.js';
import errorsMessages from '../utils/errorsMessages.js';

const validateContentType = (req, res, next) => {
  if (!req.is('application/json')) {
    return next(
      new UnsupportedMediaTypeError(
        `${errorsMessages.unsupportedMediaType} Content-Type deve ser application/json.`,
      ),
    );
  }

  next();
};

export default validateContentType;
