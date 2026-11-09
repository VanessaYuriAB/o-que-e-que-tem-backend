import { Router } from 'express';
import validateContentType from '../../shared/middlewares/validateContentType.js';
import { celebrateForCreateOrder } from './orders.validation.js';
import { createOrder } from './orders.controller.js';

// Cria um roteador para a rota principal de orders
const router = Router();

// -----------------
// Rotas públicas
// -----------------

// createOrder > '/orders'
router.post('/', validateContentType, celebrateForCreateOrder, createOrder);

// getOrderByNumber > `/orders/:orderNumber` > Query: ?email=user@email.com

export default router;
