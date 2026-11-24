import TodayRecipe from '../../src/modules/recipes/today-recipe.model.js';

describe('TodayRecipe Model', () => {
  const validDocument = {
    recipes: [
      {
        title: 'Caldo Verde Tradicional',
        category: 'sopa',
        description:
          'Clássica sopa portuguesa com batatas cremosas, couve fatiada bem fina e rodelas de paio.',
        prepTime: 40,
        servings: 6,
        difficulty: 'Fácil',
        ingredients: [
          { name: 'Batata asterix descascada', quantity: '1 kg' },
          { name: 'Couve-manteiga fatiada fina', quantity: '1 maço' },
          { name: 'Paio fatiado em rodelas', quantity: '200 g' },
          { name: 'Cebola picada', quantity: '1 unidade' },
          { name: 'Alho picado', quantity: '3 dentes' },
          { name: 'Azeite de oliva', quantity: '3 colheres de sopa' },
          { name: 'Sal e pimenta-do-reino', quantity: 'a gosto' },
        ],
        instructions: [
          'Refogue a cebola e o alho no azeite até dourarem levemente.',
          'Adicione as batatas cortadas em cubos, cubra com 1,5 litro de água e cozinhe até ficarem bem macias.',
          'Bata as batatas com o caldo no liquidificador até obter um creme liso e volte para a panela.',
          'Em uma frigideira à parte, doure as rodelas de paio e junte ao caldo.',
          'Acrescente a couve fatiada, ajuste o sal e cozinhe por mais 5 minutos antes de servir.',
        ],
      },
      {
        title: 'Creme de Mandioquinha com Alho-Poró',
        category: 'creme',
        description:
          'Creme delicado e extremamente sedoso de batata-baroa com aroma suave de alho-poró.',
        prepTime: 30,
        servings: 4,
        difficulty: 'Fácil',
        ingredients: [
          { name: 'Mandioquinha (batata-baroa) descascada', quantity: '700 g' },
          { name: 'Alho-poró fatiado (parte branca)', quantity: '1 talo' },
          { name: 'Manteiga', quantity: '2 colheres de sopa' },
          { name: 'Caldo de legumes', quantity: '750 ml' },
          { name: 'Sal e pimenta-branca', quantity: 'a gosto' },
        ],
        instructions: [
          'Derreta a manteiga em fogo baixo e refogue o alho-poró por 5 minutos sem deixar dourar.',
          'Adicione a mandioquinha em rodelas e o caldo de legumes.',
          'Cozinhe por 20 minutos até a mandioquinha desmanchar.',
          'Bata tudo no liquidificador até ficar bem cremoso, ajuste o sal e sirva.',
        ],
      },
      {
        title: 'Patê de Gorgonzola com Nozes',
        category: 'pate',
        description:
          'Patê sofisticado e marcante que combina a cremosidade do queijo azul com a crocância das nozes.',
        prepTime: 15,
        servings: 6,
        difficulty: 'Fácil',
        ingredients: [
          { name: 'Queijo gorgonzola amassado', quantity: '150 g' },
          { name: 'Cream cheese em temperatura ambiente', quantity: '150 g' },
          { name: 'Creme de leite', quantity: '2 colheres de sopa' },
          { name: 'Nozes picadas grosseiramente', quantity: '1/2 xícara' },
          { name: 'Mel (opcional para servir)', quantity: '1 fio' },
        ],
        instructions: [
          'Amasse bem o queijo gorgonzola com um garfo e misture com o cream cheese e o creme de leite.',
          'Adicione metade das nozes picadas à mistura e incorpore bem.',
          'Transfira para uma tigela, decore com o restante das nozes e sirva com torradas.',
        ],
      },
    ],
  };

  // --------
  // Válidos
  // --------

  // 1
  it('deve criar um documento válido', async () => {
    const doc = new TodayRecipe(validDocument);

    await expect(doc.validate()).resolves.toBeUndefined();
  });

  // 2
  it('deve criar um documento válido com o campo "imageUrl"', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          imageUrl:
            'https://media.istockphoto.com/id/2213083274/pt/foto/traditional-portuguese-green-soup-with-potato-green-cabbage-and-sausage-over-wooden-table.jpg?s=1024x1024&w=is&k=20&c=r59K_pD4cc1ebZmTLyelSdZi1aw3ec4s3umXkPZsX-o=',
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).resolves.toBeUndefined();
  });

  // -------------------
  // recipes (validate)
  // -------------------

  // 3
  it('deve exigir recipes', async () => {
    const doc = new TodayRecipe({});

    await expect(doc.validate()).rejects.toThrow();
  });

  // 4
  it('deve exigir exatamente 3 receitas', async () => {
    const doc = new TodayRecipe({
      recipes: validDocument.recipes.slice(0, 2),
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 5
  it('deve exigir uma receita da categoria "sopa"', async () => {
    const doc = new TodayRecipe({
      recipes: [
        validDocument.recipes[1],
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 6
  it('deve exigir uma receita da categoria "creme"', async () => {
    const doc = new TodayRecipe({
      recipes: [
        validDocument.recipes[0],
        validDocument.recipes[2],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 7
  it('deve exigir uma receita da categoria "pate"', async () => {
    const doc = new TodayRecipe({
      recipes: [
        validDocument.recipes[0],
        validDocument.recipes[1],
        validDocument.recipes[1],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // ---------
  // required
  // ---------

  // 8
  it('deve exigir title', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          title: undefined,
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 9
  it('deve exigir category', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          category: undefined,
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 10
  it('deve exigir description', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          description: undefined,
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 11
  it('deve exigir preptTime', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          prepTime: undefined,
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 12
  it('deve exigir servings', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          servings: undefined,
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 13
  it('deve exigir difficulty', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          difficulty: undefined,
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // -----
  // enum
  // -----

  // 14
  it('deve rejeitar valor fora do enum (category)', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          category: 'caldo',
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 15
  it('deve rejeitar valor fora do enum (difficulty)', async () => {
    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          difficulty: 'intermediário',
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

  // 16
  it('deve exigir ao menos um ingrediente (validate)', async () => {
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

  // 17
  it('deve exigir a propriedade "name"', async () => {
    const invalidIngredients = [
      { quantity: '1 kg' },
      { name: 'Couve-manteiga fatiada fina', quantity: '1 maço' },
    ];

    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          ingredients: invalidIngredients,
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 18
  it('deve exigir a propriedade "quantity"', async () => {
    const invalidIngredients = [
      { name: 'Batata asterix descascada' },
      { name: 'Couve-manteiga fatiada fina', quantity: '1 maço' },
    ];

    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          ingredients: invalidIngredients,
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });

  // -------------
  // instructions
  // -------------

  // 19
  it('deve exigir ao menos um passo do modo de preparo', async () => {
    const invalidInstructions = [];

    const doc = new TodayRecipe({
      recipes: [
        {
          ...validDocument.recipes[0],
          instructions: invalidInstructions,
        },
        validDocument.recipes[1],
        validDocument.recipes[2],
      ],
    });

    await expect(doc.validate()).rejects.toThrow();
  });
});
