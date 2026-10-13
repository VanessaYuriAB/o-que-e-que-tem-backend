import expressWinston from 'express-winston';
import logger from '../logger/logger.js';

const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
});

export default errorLogger;
