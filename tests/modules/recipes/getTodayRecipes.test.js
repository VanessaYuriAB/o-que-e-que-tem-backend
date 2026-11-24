// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import RecipeModel from '../../../src/modules/recipes/recipe.model.js';
import TodayRecipeModel from '../../../src/modules/recipes/today-recipe.model.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de busca de recomendações diária de receitas
// requisição HTTP > getTodayRecipes

describe('Get Today Recipes Flow > GET "/recipes/today', () => {
  // ----------------------
  // Seed
  // Cadastro de receitas
  // ----------------------

  beforeEach(async () => {
    await RecipeModel.insertMany([
      // === 2 SOPAS ===
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
      },

      // === 2 CREMES ===
      {
        title: 'Creme de Abóbora Cabotiá com Gorgonzola',
        category: 'creme',
        description:
          'Creme aveludado e adocicado de abóbora assada contrastado com o sabor intenso do queijo gorgonzola.',
        prepTime: 40,
        servings: 4,
        difficulty: 'Fácil',
        ingredients: [
          { name: 'Abóbora cabotiá em cubos', quantity: '800 g' },
          { name: 'Queijo gorgonzola esfarelado', quantity: '100 g' },
          { name: 'Creme de leite fresco', quantity: '100 ml' },
          { name: 'Cebola picada', quantity: '1 unidade' },
          { name: 'Caldo de legumes', quantity: '600 ml' },
          { name: 'Noz-moscada ralada', quantity: '1 pitada' },
        ],
        instructions: [
          'Refogue a cebola na manteiga ou azeite até ficar transparente.',
          'Junte a abóbora e o caldo de legumes e cozinhe até a abóbora ficar bem macia.',
          'Bata no liquidificador até formar um creme liso e volte para a panela.',
          'Adicione o creme de leite, a noz-moscada e metade do gorgonzola, mexendo até derreter.',
          'Sirva com o restante do gorgonzola esfarelado por cima.',
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

      // === 2 PATÊS ===
      {
        title: 'Patê de Atum Cremoso com Ervas',
        category: 'pate',
        description:
          'Patê clássico e prático de atum sólido com maionese, cream cheese e cebolinha fresca.',
        prepTime: 10,
        servings: 6,
        difficulty: 'Fácil',
        ingredients: [
          {
            name: 'Atum sólido em óleo ou água escorrido',
            quantity: '1 lata (170 g)',
          },
          {
            name: 'Cream cheese ou requeijão cremoso',
            quantity: '3 colheres de sopa',
          },
          { name: 'Maionese', quantity: '2 colheres de sopa' },
          {
            name: 'Cebolinha e salsinha picadas',
            quantity: '2 colheres de sopa',
          },
          { name: 'Suco de meio limão', quantity: '1 colher de sopa' },
        ],
        instructions: [
          'Escorra bem o líquido do atum e desfie-o com um garfo em uma tigela.',
          'Adicione o cream cheese, a maionese e o suco de limão e misture até formar uma pasta homogênea.',
          'Incorpore a cebolinha, a salsinha e ajuste o sal e a pimenta-do-reino.',
          'Leve à geladeira por 20 minutos antes de servir com torradas.',
        ],
      },
      {
        title: 'Patê de Frango Desfiado com Cenoura e Milho',
        category: 'pate',
        description:
          'Patê tradicional para sanduíches naturais, leve e colorido com cenoura ralada fina.',
        prepTime: 25,
        servings: 8,
        difficulty: 'Fácil',
        ingredients: [
          { name: 'Peito de frango cozido e bem desfiado', quantity: '300 g' },
          {
            name: 'Cenoura crua ralada no ralo fino',
            quantity: '1 unidade média',
          },
          { name: 'Milho verde escorrido', quantity: '1/2 lata' },
          { name: 'Requeijão cremoso', quantity: '1 copo (200 g)' },
          { name: 'Maionese', quantity: '2 colheres de sopa' },
          { name: 'Cheiro-verde picado', quantity: 'a gosto' },
        ],
        instructions: [
          'Processe ou pique bem fino o frango já cozido e desfiado para obter uma textura pastosa.',
          'Misture o frango com a cenoura ralada, o milho e o cheiro-verde.',
          'Acrescente o requeijão e a maionese até atingir o ponto de espalhar.',
          'Acerte o sal e conserve na geladeira em pote fechado.',
        ],
      },
    ]);
  });

  // --------
  // Válidos
  // --------

  // 1
  it('Deve retornar 3 receitas, uma de cada categoria: sopa, creme e patê', async () => {
    const res = await request.get('/recipes/today').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(3);

    const recipesCategory = res.body.map((recipe) => recipe.category);

    expect(recipesCategory).toStrictEqual(['sopa', 'creme', 'pate']);
  });

  // 2
  it('Deve retornar as mesmas receitas em chamadas realizadas na mesma data', async () => {
    const res1 = await request.get('/recipes/today');
    const res2 = await request.get('/recipes/today');

    expect(res1.body).toStrictEqual(res2.body);

    const count = await TodayRecipeModel.countDocuments();

    expect(count).toBe(1);
  });

  // 3
  it('Deve gerar novas recomendações quando não existir registro da data atual', async () => {
    await request.get('/recipes/today');

    expect(await TodayRecipeModel.countDocuments()).toBe(1);

    await TodayRecipeModel.collection.updateMany(
      {},
      {
        $set: {
          createdAt: new Date('2025-11-24'),
        },
      },
    );

    const oldDoc = await TodayRecipeModel.findOne();

    expect(oldDoc.createdAt.getFullYear()).toBe(2025);

    await request.get('/recipes/today');

    expect(await TodayRecipeModel.countDocuments()).toBe(2);
  });
});
