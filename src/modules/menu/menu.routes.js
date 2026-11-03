import { Router } from 'express';
import getMenu from './menu.controller.js';

// Cria um roteador para a rota principal de menu
const router = Router();

// ---------------
// Rotas públicas
// ---------------

// getMenu > '/menu'
// Sem validações celebrate/joi e content-type, pq é um GET
router.get('/', getMenu);

export default router;
