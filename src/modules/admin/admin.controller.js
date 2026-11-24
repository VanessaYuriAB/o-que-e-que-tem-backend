import Product from '../menu/product.model.js';

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
  await Product.findByIdAndDelete(req.params.productId);

  return res.status(204).end();
};

// replyUserMessage > '/admin/messages'

export { registerNewProduct, deleteProduct };
