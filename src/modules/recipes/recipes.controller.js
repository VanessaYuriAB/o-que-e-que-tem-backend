import Recipe from './recipe.model.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';
import TodayRecipe from './today-recipe.model.js';

// getSearchRecipes > '/recipes' : Query: ?search=searchData
const getSearchRecipes = async (req, res) => {
  const searchedRecipes = await Recipe.find(
    {
      $text: {
        $search: req.query.search, // Text Index
      },
    },
    {
      score: {
        $meta: 'textScore', // Mongo calcula uma pontuação de relevância (textScore)
      },
    },
  ).sort({
    score: {
      $meta: 'textScore', // os resultados mais relevantes aparecem primeiro
    },
  });

  if (searchedRecipes.length === 0) {
    throw new NotFoundError(
      `${errorsMessages.notFound} Erro ao pesquisar receitas: não foi encontrada nenhuma receita para "${req.query.search}".`,
    );
  }

  return res.send(searchedRecipes);
};

// getTodayRecipes > '/recipes/today'
const getTodayRecipes = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let todayRecipes = await TodayRecipe.findOne({
    createdAt: { $gte: today },
  });

  if (!todayRecipes) {
    const sopa = await Recipe.aggregate([
      { $match: { category: 'sopa' } }, // filtra
      { $sample: { size: 1 } }, // sorteia uma receita
    ]); // mecanismo que permite encadear várias operações (filtrar, agrupar, ordenar, transformar, sortear, etc.)

    const creme = await Recipe.aggregate([
      { $match: { category: 'creme' } },
      { $sample: { size: 1 } },
    ]);

    const pate = await Recipe.aggregate([
      { $match: { category: 'pate' } },
      { $sample: { size: 1 } },
    ]);

    todayRecipes = await TodayRecipe.create({
      recipes: [sopa[0], creme[0], pate[0]],
    });
  }

  return res.send(todayRecipes.recipes);
};

export { getSearchRecipes, getTodayRecipes };
