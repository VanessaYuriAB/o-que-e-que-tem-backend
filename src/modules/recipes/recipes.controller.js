import Recipe from './recipe.model.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';

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

  res.send(searchedRecipes);
};

// getTodayRecipes > '/recipes/today'

export { getSearchRecipes };
