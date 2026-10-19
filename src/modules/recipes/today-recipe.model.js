import mongoose from 'mongoose';

const todayRecipeSchema = new mongoose.Schema(
  /* Campos */
  {
    recipes: {
      type: [
        {
          name: {
            type: String,
            required: true,
            enum: ['Sopa', 'Creme', 'Patê'],
          },

          ingredients: {
            type: [
              {
                type: String,
                required: true,
                match: /^[^<>]+$/, // bloqueia HTML básico por segurança ('<' e '>')
                trim: true,
              },
            ],
            required: true,
            validate: {
              validator: (ingredients) => ingredients.length > 0,
              message: 'A receita deve possuir ao menos um ingrediente.',
            }, // pq 'required: true' em arrays verifica a existência do campo, ñ a qtdd de itens
          },

          preparation: {
            type: String,
            required: true,
            match: /^[^<>]+$/, // bloqueia HTML básico por segurança ('<' e '>')
            trim: true,
          },
        },
      ],
      required: true,
      validate: {
        validator: (recipes) => {
          if (recipes.length !== 3) {
            return false;
          }

          const names = recipes.map((recipe) => recipe.name);

          return (
            new Set(names).size === 3 &&
            names.includes('Sopa') &&
            names.includes('Creme') &&
            names.includes('Patê')
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
