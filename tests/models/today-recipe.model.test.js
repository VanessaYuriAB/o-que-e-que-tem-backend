import TodayRecipe from '../../src/modules/recipes/today-recipe.model.js';

describe('TodayRecipe Model', () => {
  const validDocument = {
    recipes: [
      {
        name: 'Sopa',
        ingredients: ['Abóbora', 'Cebola'],
        preparation: 'Cozinhar os ingredientes.',
      },
      {
        name: 'Creme',
        ingredients: ['Batata', 'Leite'],
        preparation: 'Bater tudo no liquidificador.',
      },
      {
        name: 'Patê',
        ingredients: ['Ricota', 'Cenoura'],
        preparation: 'Misturar os ingredientes.',
      },
    ],
  };

  // -------
  // Válido
  // -------

  // 1
  it('deve criar um documento válido', async () => {
    const doc = new TodayRecipe(validDocument);

    await expect(doc.validate()).resolves.toBeUndefined();
  });

  // --------
  // recipes
  // --------

  // 2
  it('deve exigir recipes', async () => {
    const doc = new TodayRecipe({});

    await expect(doc.validate()).rejects.toThrow();
  });

  // 3
  it('deve exigir exatamente 3 receitas', async () => {
    const doc = new TodayRecipe({
      recipes: validDocument.recipes.slice(0, 2),
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 4
  it('deve exigir uma receita do tipo Sopa', async () => {
    const doc = new TodayRecipe({
      recipes: [
        validDocument.recipes[1],
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 5
  it('deve exigir uma receita do tipo Creme', async () => {
    const doc = new TodayRecipe({
      recipes: [
        validDocument.recipes[0],
        validDocument.recipes[2],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 6
  it('deve exigir uma receita do tipo Patê', async () => {
    const doc = new TodayRecipe({
      recipes: [
        validDocument.recipes[0],
        validDocument.recipes[1],
        validDocument.recipes[1],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 7
  it('deve rejeitar tipos duplicados', async () => {
    const doc = new TodayRecipe({
      recipes: [
        validDocument.recipes[0],
        validDocument.recipes[0],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // -----
  // name
  // -----

  // 8
  it('deve rejeitar valor fora do enum', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          name: 'Caldo',
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // ------------
  // ingredients
  // ------------

  // 9
  it('deve exigir ingredientes', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          ingredients: undefined,
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 10
  it('deve exigir ao menos um ingrediente', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          ingredients: [],
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 11
  it('deve rejeitar HTML nos ingredientes', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          ingredients: ['<script>'],
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // ------------
  // preparation
  // ------------

  // 12
  it('deve exigir preparation', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          preparation: undefined,
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 13
  it('deve rejeitar HTML em preparation', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          preparation: '<script>',
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });
});
