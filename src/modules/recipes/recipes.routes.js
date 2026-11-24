import { Router } from 'express';
import celebrateForGetSearchRecipes from './recipes.validation.js';
import { getSearchRecipes, getTodayRecipes } from './recipes.controller.js';

// Cria um roteador para a rota principal de recipes
const router = Router();

// ---------------
// Rotas públicas
// ---------------

// getSearchRecipes > '/recipes' : Query: ?search=searchData
router.get('/', celebrateForGetSearchRecipes, getSearchRecipes);

// getTodayRecipes > '/recipes/today'
router.get('/today', getTodayRecipes);

export default router;
