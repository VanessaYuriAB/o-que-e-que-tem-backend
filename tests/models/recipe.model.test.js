import Recipe from '../../src/modules/recipes/recipe.model.js';

describe('Recipe Model', () => {
  // Payload válido (sem imageUrl)
  const validDocument = {
    title: 'Canja de Galinha Caseira',
    category: 'sopa',
    description:
      'Sopa reconfortante de frango desfiado, arroz, cenoura e cheiro-verde fresco.',
    prepTime: 45,
    servings: 6,
    difficulty: 'Fácil',
    ingredients: [
      { name: 'Peito de frango sem osso', quantity: '500 g' },
      { name: 'Arroz branco lavado', quantity: '1 xícara' },
      { name: 'Cenoura em cubinhos', quantity: '2 unidades' },
      { name: 'Batata em cubinhos', quantity: '2 unidades' },
      { name: 'Cebola picada', quantity: '1 unidade' },
      { name: 'Alho picado', quantity: '3 dentes' },
      { name: 'Cheiro-verde picado', quantity: '1/2 xícara' },
    ],
    instructions: [
      'Refogue o alho e a cebola em um fio de azeite, junte o frango e sele bem.',
      'Cubra com 2 litros de água, tempere com sal e cozinhe por 20 minutos.',
      'Retire o frango, desfie e reserve. No mesmo caldo, adicione o arroz, a cenoura e a batata.',
      'Quando o arroz e os legumes estiverem macios, volte o frango desfiado para a panela.',
      'Finalize com o cheiro-verde picado e sirva bem quente.',
    ],
  };

  // -------
  // Válido
  // -------

  // 1
  it('deve criar um documento válido', async () => {
    const doc = new Recipe(validDocument);

    await expect(doc.validate()).resolves.toBeUndefined();
  });

  // ---------
  // required
  // ---------

  // 2
  it('deve exigir title', async () => {
    const payload = { ...validDocument };
    delete payload.title;

    const doc = new Recipe(payload);

    await expect(doc.validate()).rejects.toThrow();
  });

  // 3
  it('deve exigir category', async () => {
    const payload = { ...validDocument };
    delete payload.category;

    const doc = new Recipe(payload);

    await expect(doc.validate()).rejects.toThrow();
  });

  // 4
  it('deve exigir description', async () => {
    const payload = { ...validDocument };
    delete payload.description;

    const doc = new Recipe(payload);

    await expect(doc.validate()).rejects.toThrow();
  });

  // 5
  it('deve exigir prepTime', async () => {
    const payload = { ...validDocument };
    delete payload.prepTime;

    const doc = new Recipe(payload);

    await expect(doc.validate()).rejects.toThrow();
  });

  // 6
  it('deve exigir servings', async () => {
    const payload = { ...validDocument };
    delete payload.servings;

    const doc = new Recipe(payload);

    await expect(doc.validate()).rejects.toThrow();
  });

  // 7
  it('deve exigir difficulty', async () => {
    const payload = { ...validDocument };
    delete payload.difficulty;

    const doc = new Recipe(payload);

    await expect(doc.validate()).rejects.toThrow();
  });

  // 8
  it('deve exigir instructions', async () => {
    const payload = { ...validDocument };
    delete payload.instructions;

    const doc = new Recipe(payload);

    await expect(doc.validate()).rejects.toThrow();
  });

  // 9
  it('deve exigir ingredients.name', async () => {
    const payload = structuredClone(validDocument); // spread faz cópia rasa, então pode alterar validDocument tbm, quebrando testes posteriores, pq apontam para o msm array interno
    delete payload.ingredients[0].name;

    const doc = new Recipe(payload);

    await expect(doc.validate()).rejects.toThrow();
  });

  // 10
  it('deve exigir ingredients.quantity', async () => {
    const payload = structuredClone(validDocument); // spread faz cópia rasa, então pode alterar validDocument tbm, quebrando testes posteriores, pq apontam para o msm array interno
    delete payload.ingredients[0].quantity;

    const doc = new Recipe(payload);

    await expect(doc.validate()).rejects.toThrow();
  });

  // ---------
  // validate
  // ---------

  // 11
  it('deve exigir ao menos um ingrediente', async () => {
    const payload = { ...validDocument };
    delete payload.ingredients;

    const doc = new Recipe(payload);

    await expect(doc.validate()).rejects.toThrow();
  });

  // 12
  it('deve exigir ao menos uma instrução', async () => {
    const payload = { ...validDocument, instructions: [] };

    const doc = new Recipe(payload);

    await expect(doc.validate()).rejects.toThrow();
  });

  // -----
  // enum
  // -----

  // 13
  it('deve rejeitar valor fora do enum (category)', async () => {
    const doc = new Recipe({ ...validDocument, category: 'risoto' });

    await expect(doc.validate()).rejects.toThrow();
  });

  // 14
  it('deve rejeitar valor fora do enum (difficulty)', async () => {
    const doc = new Recipe({ ...validDocument, difficulty: 'Intermediário' });

    await expect(doc.validate()).rejects.toThrow();
  });

  // ---------
  // imageUrl
  // ---------

  // 15
  it('deve aceitar imageUrl', async () => {
    const doc = new Recipe({
      ...validDocument,
      imageUrl:
        'https://media.istockphoto.com/id/1834142662/pt/foto/top-view-bowl-of-chicken-noodle-soup-on-white-marble-backdrop.jpg?s=1024x1024&w=is&k=20&c=dG4DbXxK75EKI9vyEfiu3bRB8jZnIka32SXV7P7KCDU=',
    });

    await expect(doc.validate()).resolves.toBeUndefined();
  });

  // -----------
  // Text Index
  // -----------

  // 16
  it('deve localizar a receita pelo .index()', async () => {
    await Recipe.create(validDocument);

    const searched = await Recipe.find({
      $text: {
        $search: 'Canja',
      },
    });

    expect(searched.length).toBeGreaterThan(0);
  });
});
