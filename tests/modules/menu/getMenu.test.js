// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../../src/app.js';
// Utils
import ProductModel from '../../../src/modules/menu/product.model.js';

// Request to test
const request = supertest(app);

// Testes de integração (HTTP + DB) > fluxo de busca de menu (cardápio)
// getMenu

describe('Get Menu Flow > GET "/menu"', () => {
  // ----------------------
  // Seed
  // Cadastro de produtos
  // ----------------------

  beforeEach(async () => {
    await ProductModel.insertMany([
      // verduras e legumes
      {
        productName: 'Cenoura',
        category: 'verduras-legumes',
        qtyAvailable: 0, // sem estoque
        partnerName: 'Mercado 3',
        availableUntil: new Date('2026-12-31T23:59:59Z'),
      },

      // carboidratos
      {
        productName: 'Macarrão integral',
        category: 'carboidratos',
        qtyAvailable: 20,
        partnerName: 'Mercado 3',
        availableUntil: new Date('2020-01-01'), // vencido
      },

      // leguminosas e oleaginosas
      {
        productName: 'Linhaça',
        category: 'leguminosas-oleaginosas',
        qtyAvailable: 30,
        partnerName: 'Mercado 3',
        availableUntil: new Date('2026-12-31T23:59:59Z'),
      },

      // leites e derivados
      {
        productName: 'Leite integral',
        category: 'leites-derivados',
        qtyAvailable: 18,
        partnerName: 'Mercado 3',
        availableUntil: new Date('2026-12-31T23:59:59Z'),
      },

      // carnes, ovos e peixes
      {
        productName: 'Ovo de codorna',
        category: 'carnes-ovos-peixes',
        qtyAvailable: 60,
        partnerName: 'Mercado 3',
        availableUntil: new Date('2026-12-31T23:59:59Z'),
      },

      // óleos e gorduras
      {
        productName: 'Manteiga',
        category: 'oleos-gorduras',
        qtyAvailable: 8,
        partnerName: 'Mercado 3',
        availableUntil: new Date('2026-12-31T23:59:59Z'),
      },

      // açucares e doces
      {
        productName: 'Açúcar mascavo',
        category: 'acucares-doces',
        qtyAvailable: 40,
        partnerName: 'Mercado 1',
        availableUntil: new Date('2026-12-31T23:59:59Z'),
      },
    ]);
  });

  // --------
  // Válidos
  // --------

  // 1
  it('Deve retornar 5 dos 7 produtos do cardápio, apenas os disponíveis e em prazo de validade', async () => {
    const res = await request.get('/menu').expect(200);

    expect(res.body).toHaveProperty('itemsMenu');
    expect(Array.isArray(res.body.itemsMenu)).toBe(true);
    expect(res.body.itemsMenu).toHaveLength(5);

    const productNames = res.body.itemsMenu.map(
      (product) => product.productName,
    );

    expect(productNames).not.toContain('Cenoura');
    expect(productNames).not.toContain('Macarrão integral');
  });

  // 2
  it('Deve retornar produtos com os campos esperados', async () => {
    const res = await request.get('/menu').expect(200);

    const [product] = res.body.itemsMenu;

    expect(product).toHaveProperty('_id');
    expect(product).toHaveProperty('productName');
    expect(product).toHaveProperty('category');
    expect(product).toHaveProperty('qtyAvailable');
    expect(product).toHaveProperty('partnerName');
    expect(product).toHaveProperty('availableUntil');

    expect(product).toHaveProperty('createdAt');
    expect(product).toHaveProperty('updatedAt');
  });

  // 3
  it('Deve retornar lista vazia quando não houver produtos', async () => {
    await ProductModel.deleteMany({});

    const res = await request.get('/menu').expect(200);

    expect(res.body.itemsMenu).toEqual([]);
  });
});
