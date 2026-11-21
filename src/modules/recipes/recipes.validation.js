import { celebrate, Joi } from 'celebrate';

// getSearchRecipes > '/recipes' : Query: ?search=searchData
const celebrateForGetSearchRecipes = celebrate({
  query: Joi.object({
    search: Joi.string()
      .pattern(/^[^<>]+$/)
      .trim()
      .required(),
  }).unknown(false),
});

// getTodayRecipes > '/recipes/today'

export { celebrateForGetSearchRecipes };
