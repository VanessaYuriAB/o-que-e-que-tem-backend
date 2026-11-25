import Product from '../menu/product.model.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';

// registerNewProduct > '/admin/menu'
const registerNewProduct = async (req, res) => {
  const newProduct = await Product.create({
    productName: req.body.productName,
    category: req.body.category,
    qtyAvailable: req.body.qtyAvailable,
    partnerName: req.body.partnerName,
    availableUntil: req.body.availableUntil,
  });

  return res.status(201).send(newProduct);
};

// deleteProduct > '/admin/menu/:productId'
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.productId);

  if (!product) {
    throw new NotFoundError(
      `${errorsMessages.notFound} Erro ao remover produto: item não encontrado.`,
    );
  }

  return res.status(204).end();
};

// replyUserMessage > '/admin/messages'

export { registerNewProduct, deleteProduct };
