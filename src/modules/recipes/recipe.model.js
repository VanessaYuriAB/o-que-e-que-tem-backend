import mongoose from 'mongoose';
import { MEAL_TYPES } from '../../shared/utils/constants.js';

const recipeSchema = new mongoose.Schema(
  /* Campos */
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
      },
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
        message: 'A receita deve ter pelo menos um passo no modo de preparo.',
      }, // evita que alguém salve uma receita com o array vazio [], já que o Mongoose aceita arrays vazios por padrão mesmo com required: true
    },
  },

  /* Opções */

  {
    timestamps: true,
    // Cria 'createdAt' e 'updatedAt' automaticamente
  },
);

// Índice de busca (Text Index)
recipeSchema.index({
  title: 'text',
  description: 'text',
  'ingredients.name': 'text',
});

export default mongoose.model('Recipe', recipeSchema);
