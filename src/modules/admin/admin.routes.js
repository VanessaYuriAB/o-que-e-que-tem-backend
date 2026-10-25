import { Router } from 'express';
import { celebrateForAccessToken } from '../auth/auth.validation.js';
import env from '../../config/env.js';
import { accessMiddleware } from '../auth/auth.middleware.js';
import roleMiddleware from '../../shared/middlewares/roleMiddleware.js';

// Cria um roteador para a rota principal de admin
const router = Router();

// ------------------------------
// Rotas privadas
// (exigem autorização via role)
// ------------------------------

// Rota teste para ambiente de desenvolvimento/teste > '/admin/health'
if (env.NODE_ENV !== 'production') {
  router.get(
    '/health',
    celebrateForAccessToken,
    accessMiddleware,
    roleMiddleware('admin'), // rota utilizada para testes do roleMiddleware
    (req, res) => {
      res.json({
        status: 'admin ok',
        role: req.user.role,
      });
    },
  );
}

export default router;
