import { Router } from 'express';
import validateContentType from '../../shared/middlewares/validateContentType.js';
import {
  celebrateForRegister,
  celebrateForLogin,
  celebrateForAccessToken,
  celebrateForRefreshToken,
} from './auth.validation.js';
import {
  registerUser,
  loginUser,
  refreshUser,
  refreshAccess,
  logoutUser,
} from './auth.controller.js';
import env from '../../config/env.js';
import {
  accessMiddleware,
  refreshMiddleware,
  roleMiddleware,
} from './auth.middleware.js';

// Cria um roteador para a rota principal de auth
const router = Router();

// ---------------
// Rotas públicas
// ---------------

// register > '/auth/register'
router.post(
  '/register',
  validateContentType,
  celebrateForRegister,
  registerUser,
);

// login > '/auth/login'
router.post('/login', validateContentType, celebrateForLogin, loginUser);

// ------------------------------
// Rotas privadas
// (exigem autenticação via JWT)
// ------------------------------

// Rota teste para ambiente de desenvolvimento/teste > '/auth/health'
if (env.NODE_ENV !== 'production') {
  router.get(
    '/health',
    celebrateForAccessToken,
    accessMiddleware, // rota utilizada para testes do accessMiddleware
    (req, res) => {
      res.json({
        status: 'auth ok',
        reqUserPayload: req.user,
      });
    },
  );
}

// refresh (user) > '/auth/me'
router.get('/me', celebrateForRefreshToken, refreshMiddleware, refreshUser);

// refresh (token) > '/auth/access'
router.post(
  '/access',
  celebrateForRefreshToken,
  refreshMiddleware,
  refreshAccess,
);

// logout > '/auth/logout'
router.post('/logout', celebrateForRefreshToken, logoutUser);

// ------------------------------
// Rotas privadas
// (exigem autorização via role)
// ------------------------------

// Rota teste para ambiente de desenvolvimento/teste > '/auth/admin-health'
if (env.NODE_ENV !== 'production') {
  router.get(
    '/admin-health',
    celebrateForAccessToken,
    accessMiddleware,
    roleMiddleware('admin'), // rota utilizada para testes do roleMiddleware
    (req, res) => {
      res.json({
        status: 'auth admin ok',
        role: req.user.role,
      });
    },
  );
}

export default router;
