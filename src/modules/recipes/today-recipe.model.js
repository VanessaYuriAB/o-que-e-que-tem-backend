import mongoose from 'mongoose';
import { MEAL_TYPES } from '../../shared/utils/constants.js';

const todayRecipeSchema = new mongoose.Schema(
  /* Campos */
  {
    recipes: {
      type: [
        {
          title: {
            type: String,
            required: true,
            trim: true,
          },

          category: {
            type: String,
            required: true,
            enum: MEAL_TYPES,
          },

          description: {
            type: String,
            required: true,
            trim: true,
          },

          prepTime: {
            type: Number,
            required: true,
          },

          servings: {
            type: Number,
            required: true,
          },

          difficulty: {
            type: String,
            required: true,
            enum: ['Fácil', 'Médio', 'Difícil'],
          },

          imageUrl: {
            type: String,
            default: '',
          },

          ingredients: {
            type: [
              {
                name: {
                  type: String,
                  required: true,
                  trim: true,
                },
                quantity: {
                  type: String,
                  required: true,
                  trim: true,
                },
              },
            ],
            required: true,
            validate: {
              validator: (arr) => arr.length > 0,
              message: 'A receita deve possuir ao menos um ingrediente.',
            }, // pq 'required: true' em arrays verifica a existência do campo, ñ a qtdd de itens
          },

          instructions: {
            type: [
              {
                type: String,
                required: true,
                trim: true,
              },
            ],
            required: true,
            validate: {
              validator: (arr) => arr.length > 0,
              message:
                'A receita deve ter pelo menos um passo no modo de preparo.',
            },
          },
        },
      ],

      required: true,

      validate: {
        validator: (recipes) => {
          if (recipes.length !== 3) {
            return false;
          }

          const categories = recipes.map((recipe) => recipe.category);

          return (
            new Set(categories).size === 3 &&
            categories.includes('sopa') &&
            categories.includes('creme') &&
            categories.includes('pate')
          );
        },
        message:
          'É necessário haver exatamente uma receita para cada tipo de refeição: sopa, creme e patê.',
      },
    },
  },

  /* Opções */
  {
    timestamps: true,
    // Cria 'createdAt' e 'updatedAt' automaticamente
  },
);

export default mongoose.model('TodayRecipe', todayRecipeSchema);
