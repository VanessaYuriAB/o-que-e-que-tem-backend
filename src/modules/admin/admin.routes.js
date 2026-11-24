import { Router } from 'express';
import { celebrateForAccessToken } from '../auth/auth.validation.js';
import env from '../../config/env.js';
import { accessMiddleware } from '../auth/auth.middleware.js';
import roleMiddleware from '../../shared/middlewares/roleMiddleware.js';
import {
  celebrateForDeleteProduct,
  celebrateForRegisterNewProduct,
} from './admin.validation.js';
import { deleteProduct, registerNewProduct } from './admin.controller.js';

// Cria um roteador para a rota principal de admin
const router = Router();

// -----------------------------------------------------
// Rotas privadas
// (exigem autenticação via JWT + autorização via role)
// -----------------------------------------------------

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

// registerNewProduct > '/admin/menu'
router.post(
  '/menu',
  celebrateForAccessToken,
  accessMiddleware,
  roleMiddleware('admin'),
  celebrateForRegisterNewProduct,
  registerNewProduct,
);

// deleteProduct > '/admin/menu/:productId'
router.delete(
  '/menu/:productId',
  celebrateForAccessToken,
  accessMiddleware,
  roleMiddleware('admin'),
  celebrateForDeleteProduct,
  deleteProduct,
);

// replyUserMessage > '/admin/messages'

export default router;
