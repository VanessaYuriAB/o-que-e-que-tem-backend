import Product from '../../src/modules/menu/product.model.js';

describe('Product Model', () => {
  // -------
  // Válido
  // -------

  // 1
  it('deve criar um produto válido', async () => {
    const product = new Product({
      productName: 'Abóbora',
      category: 'verduras-legumes',
      qtyAvailable: 10,
      partnerName: 'Mercado 1',
      availableUntil: new Date(),
    });

    await expect(product.validate()).resolves.toBeUndefined();
  });

  // ---------
  // Required
  // ---------

  // 2
  it('deve exigir productName', async () => {
    const product = new Product({
      category: 'verduras-legumes',
      qtyAvailable: 10,
      partnerName: 'Mercado 1',
      availableUntil: new Date(),
    });

    await expect(product.validate()).rejects.toMatchObject({
      errors: {
        productName: expect.any(Object),
      },
    });
  });

  // 3
  it('deve exigir partnerName', async () => {
    const product = new Product({
      productName: 'Abóbora',
      category: 'verduras-legumes',
      qtyAvailable: 10,
      availableUntil: new Date(),
    });

    await expect(product.validate()).rejects.toMatchObject({
      errors: {
        partnerName: expect.any(Object),
      },
    });
  });

  // 4
  it('deve exigir availableUntil', async () => {
    const product = new Product({
      productName: 'Abóbora',
      category: 'verduras-legumes',
      qtyAvailable: 10,
      partnerName: 'Mercado 1',
    });

    await expect(product.validate()).rejects.toMatchObject({
      errors: {
        availableUntil: expect.any(Object),
      },
    });
  });

  // -----
  // Enum
  // -----

  // 5
  it('deve rejeitar category inválida', async () => {
    const product = new Product({
      productName: 'Abóbora',
      category: 'frutas',
      qtyAvailable: 10,
      partnerName: 'Mercado 1',
      availableUntil: new Date(),
    });

    await expect(product.validate()).rejects.toMatchObject({
      errors: {
        category: expect.any(Object),
      },
    });
  });

  // ----
  // Min
  // ----

  // 6
  it('deve rejeitar qtyAvailable negativo', async () => {
    const product = new Product({
      productName: 'Abóbora',
      category: 'verduras-legumes',
      qtyAvailable: -1,
      partnerName: 'Mercado 1',
      availableUntil: new Date(),
    });

    await expect(product.validate()).rejects.toMatchObject({
      errors: {
        qtyAvailable: expect.any(Object),
      },
    });
  });

  // -----
  // Trim
  // -----

  // 7
  it('deve remover espaços de productName', () => {
    const product = new Product({
      productName: '  Abóbora  ',
      category: 'verduras-legumes',
      qtyAvailable: 10,
      partnerName: 'Mercado 1',
      availableUntil: new Date(),
    });

    expect(product.productName).toBe('Abóbora');
  });
});
