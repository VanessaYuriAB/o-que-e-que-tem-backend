import { Router } from 'express';
import { celebrateForAccessToken } from '../auth/auth.validation.js';
import { accessMiddleware } from '../auth/auth.middleware.js';
import validateContentType from '../../shared/middlewares/validateContentType.js';
import { celebrateForUpdateUser } from './users.validation.js';
import { updateUserProfile } from './users.controller.js';

// Cria um roteador para a rota principal de users
const router = Router();

// -------------------------------------------------------------
// Rotas privadas
// (exigem autenticação via JWT + autorização por proprietário)
// -------------------------------------------------------------

// updateUserProfile > '/users/me'
router.patch(
  '/me',
  celebrateForAccessToken,
  accessMiddleware,
  validateContentType,
  celebrateForUpdateUser,
  updateUserProfile,
);

// updateSubscriptionProfile > '/users/subscriptions/me'

// getOrdersByUserId > '/users/:userId/orders'

// getSubscriptionOrdersByUserId > '/users/:userId/subscriptions/orders'

// getMessagesByUserId > '/users/:userId/messages'

export default router;
