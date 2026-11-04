import { Router } from 'express';
import validateContentType from '../../shared/middlewares/validateContentType.js';
import celebrateForRegisterUserMsg from './contact.validation.js';
import registerUserMsg from './contact.controller.js';

// Cria um roteador para a rota principal de messages
const router = Router();

// ---------------
// Rotas públicas
// ---------------

// registerUserMsg > '/messages'
router.post(
  '/',
  validateContentType,
  celebrateForRegisterUserMsg,
  registerUserMsg,
);

export default router;
