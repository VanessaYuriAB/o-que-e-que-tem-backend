import { Router } from 'express';
import validateContentType from '../../shared/middlewares/validateContentType.js';
import { celebrateForRegister } from './auth.validation.js';
import { registerUser } from './auth.controller.js';

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

// ------------------------------
// Rotas privadas
// (exigem autenticação via JWT)
// ------------------------------

// logout > '/auth/logout'

// refresh > '/auth/me'

export default router;
