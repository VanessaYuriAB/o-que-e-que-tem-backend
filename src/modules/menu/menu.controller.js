import Product from './product.model.js';

// getMenu > '/menu'
const getMenu = async (req, res) => {
  // find() retorna todos os documentos da collection, com controle de disponibilidade de qtdd e vencimento
  // lean() evita criar instâncias completas do Mongoose, melhorando performance
  const itemsMenu = await Product.find({
    qtyAvailable: { $gt: 0 },
    availableUntil: { $gte: new Date() },
  }).lean();

  // Envia dados conforme contrato do endpoint no frontend
  res.send({ itemsMenu });
};

export default getMenu;
