import rateLimit from 'express-rate-limit';
import RateLimitError from '../errors/RateLimitError.js';
import errorsMessages from '../utils/errorsMessages.js';

// Limita o número de requisições por IP em um intervalo de tempo
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // janela de 15 minutos
  max: Number(process.env.RATE_LIMIT_MAX), // máximo de requisições por IP

  standardHeaders: true, // Envia headers modernos/padronizados: qual o limite, quantas requisições restam e quando a janela será resetada
  legacyHeaders: false, // Bloqueia headers antigos, usados antes da padronização

  handler: (req, res, next) => {
    // Encaminha erro customizado para o middleware central de erros
    next(
      new RateLimitError(
        `${errorsMessages.rateLimit} Tente novamente em 15 minutos.`,
      ),
    );
  },
});

export default limiter;
