import { Router } from 'express';
import validateContentType from '../../shared/middlewares/validateContentType.js';
import {
  celebrateForRegister,
  celebrateForLogin,
  celebrateForAccessToken,
} from './auth.validation.js';
import { registerUser, loginUser } from './auth.controller.js';
import env from '../../config/env.js';
import authMiddleware from './auth.middleware.js';

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
  router.get('/health', celebrateForAccessToken, authMiddleware, (req, res) => {
    res.json({ status: 'auth ok', reqUserPayload: req.user });
  });
}

// logout > '/auth/logout'

// refresh > '/auth/me'

export default router;
