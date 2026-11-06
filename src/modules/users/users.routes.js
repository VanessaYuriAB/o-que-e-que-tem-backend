import { Router } from 'express';
import { celebrateForAccessToken } from '../auth/auth.validation.js';
import { accessMiddleware } from '../auth/auth.middleware.js';
import validateContentType from '../../shared/middlewares/validateContentType.js';
import {
  celebrateForGetUserMsgs,
  celebrateForUpdateSubscription,
  celebrateForUpdateUser,
} from './users.validation.js';
import {
  updateUserProfile,
  updateSubscriptionProfile,
  getUserMsgs,
} from './users.controller.js';
import isOwnerOrAdminMiddleware from '../../shared/middlewares/isOwnerOrAdminMiddleware.js';

// Cria um roteador para a rota principal de users
const router = Router();

// ------------------------------
// Rotas privadas
// (exigem autenticação via JWT)
// ------------------------------

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
router.patch(
  '/subscriptions/me',
  celebrateForAccessToken,
  accessMiddleware,
  validateContentType,
  celebrateForUpdateSubscription,
  updateSubscriptionProfile,
);

// -------------------------------------------------------------
// Rotas privadas
// (exigem autenticação via JWT + autorização por proprietário)
// -------------------------------------------------------------

// getOrdersByUserId > '/users/:userId/orders'

// getSubscriptionOrdersByUserId > '/users/:userId/subscriptions/orders'

// getMessagesByUserId > '/users/:userId/messages'
router.get(
  '/:userId/messages',
  celebrateForAccessToken,
  celebrateForGetUserMsgs,
  accessMiddleware,
  isOwnerOrAdminMiddleware('userId'),
  getUserMsgs,
);

export default router;
