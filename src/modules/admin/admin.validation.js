import { celebrate, Joi } from 'celebrate';
import { PRODUCTS_CATEGORIES } from '../../shared/utils/constants.js';

// registerNewProduct > '/admin/menu'
const celebrateForRegisterNewProduct = celebrate({
  body: Joi.object()
    .keys({
      productName: Joi.string().required(),
      category: Joi.string()
        .valid(...PRODUCTS_CATEGORIES)
        .required(),
      qtyAvailable: Joi.number().min(0).required(),
      partnerName: Joi.string().required(),
      availableUntil: Joi.date().required(),
    })
    .unknown(false),
});

// deleteProduct > '/admin/menu/:productId'
const celebrateForDeleteProduct = celebrate({
  params: Joi.object({
    productId: Joi.string().hex().length(24).required(),
  }),
});

// replyUserMessage > '/admin/messages'

export { celebrateForRegisterNewProduct, celebrateForDeleteProduct };
