import { Router } from 'express';
import validateContentType from '../../shared/middlewares/validateContentType.js';
import celebrateForRegisterPartner from './partners.validation.js';
import registerPartner from './partners.controller.js';

// Cria um roteador para a rota principal de partners
const router = Router();

// ---------------
// Rotas públicas
// ---------------

// registerPartner > '/partners'
router.post(
  '/',
  validateContentType,
  celebrateForRegisterPartner,
  registerPartner,
);

export default router;
