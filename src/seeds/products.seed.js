import connectDb from '../config/database.js';
import mongoose from 'mongoose';
import Product from '../modules/menu/product.model.js';
import logger from '../shared/logger/logger.js';

await connectDb();

await Product.deleteMany({});

const insertedProducts = await Product.insertMany([
  // verduras e legumes
  {
    productName: 'Abóbora',
    category: 'verduras-legumes',
    qtyAvailable: 10,
    partnerName: 'Mercado 1',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
  {
    productName: 'Espinafre',
    category: 'verduras-legumes',
    qtyAvailable: 10,
    partnerName: 'Mercado 2',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
  {
    productName: 'Cenoura',
    category: 'verduras-legumes',
    qtyAvailable: 10,
    partnerName: 'Mercado 3',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },

  // carboidratos
  {
    productName: 'Mandioca',
    category: 'carboidratos',
    qtyAvailable: 30,
    partnerName: 'Mercado 1',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
  {
    productName: 'Batata',
    category: 'carboidratos',
    qtyAvailable: 20,
    partnerName: 'Mercado 2',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
  {
    productName: 'Macarrão integral',
    category: 'carboidratos',
    qtyAvailable: 20,
    partnerName: 'Mercado 3',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },

  // leguminosas e oleaginosas
  {
    productName: 'Grão de bico',
    category: 'leguminosas-oleaginosas',
    qtyAvailable: 25,
    partnerName: 'Mercado 1',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
  {
    productName: 'Feijão preto',
    category: 'leguminosas-oleaginosas',
    qtyAvailable: 30,
    partnerName: 'Mercado 2',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
  {
    productName: 'Linhaça',
    category: 'leguminosas-oleaginosas',
    qtyAvailable: 30,
    partnerName: 'Mercado 3',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },

  // leites e derivados
  {
    productName: 'Leite de soja',
    category: 'leites-derivados',
    qtyAvailable: 15,
    partnerName: 'Mercado 1',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
  {
    productName: 'Queijo muçarela',
    category: 'leites-derivados',
    qtyAvailable: 12,
    partnerName: 'Mercado 2',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
  {
    productName: 'Leite integral',
    category: 'leites-derivados',
    qtyAvailable: 18,
    partnerName: 'Mercado 3',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },

  // carnes, ovos e peixes
  {
    productName: 'Peito de frango',
    category: 'carnes-ovos-peixes',
    qtyAvailable: 18,
    partnerName: 'Mercado 1',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
  {
    productName: 'Carne de soja (PTS)',
    category: 'carnes-ovos-peixes',
    qtyAvailable: 60,
    partnerName: 'Mercado 2',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
  {
    productName: 'Ovo de codorna',
    category: 'carnes-ovos-peixes',
    qtyAvailable: 60,
    partnerName: 'Mercado 3',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },

  // óleos e gorduras
  {
    productName: 'Azeite de oliva',
    category: 'oleos-gorduras',
    qtyAvailable: 8,
    partnerName: 'Mercado 1',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
  {
    productName: 'Óleo de gergelim',
    category: 'oleos-gorduras',
    qtyAvailable: 22,
    partnerName: 'Mercado 2',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
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
  {
    productName: 'Mel',
    category: 'acucares-doces',
    qtyAvailable: 14,
    partnerName: 'Mercado 2',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
  {
    productName: 'Melado de cana',
    category: 'acucares-doces',
    qtyAvailable: 14,
    partnerName: 'Mercado 3',
    availableUntil: new Date('2026-12-31T23:59:59Z'),
  },
]);

logger.info(
  `Cadastro de ${insertedProducts.length} produtos seed enviado com sucesso`,
);

await mongoose.disconnect();

process.exit(0);
