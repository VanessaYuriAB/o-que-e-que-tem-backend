import { Router } from 'express';
import { celebrateForAccessToken } from '../auth/auth.validation.js';
import { accessMiddleware } from '../auth/auth.middleware.js';
import validateContentType from '../../shared/middlewares/validateContentType.js';
import {
  celebrateForCreateSubscription,
  celebrateForCreateSubscriptionOrder,
} from './subscriptions.validation.js';
import {
  createSubscription,
  createSubscriptionOrder,
} from './subscriptions.controller.js';

// Cria um roteador para a rota principal de subscriptions
const router = Router();

// ---------------
// Rotas públicas
// ---------------

// getSubscriptionOrderByNumber > `/subscriptions/orders/:subscriptionOrderNumber` > Query:
// ?email=user@email.com

// ------------------------------
// Rotas privadas
// (exigem autenticação via JWT)
// ------------------------------

// createSubscription > '/subscriptions'
// Quando chegar aqui, se o usuário não possuía cadastro, ele foi realizado antes do envio da criação da assinatura, pelo hook da feature no frontend - portanto haverá JWT com _id
router.post(
  '/',
  celebrateForAccessToken,
  accessMiddleware,
  validateContentType,
  celebrateForCreateSubscription,
  createSubscription,
);

// createSubscriptionOrder > '/subscriptions/orders'
router.post(
  '/orders',
  celebrateForAccessToken,
  accessMiddleware,
  validateContentType,
  celebrateForCreateSubscriptionOrder,
  createSubscriptionOrder,
);

export default router;
