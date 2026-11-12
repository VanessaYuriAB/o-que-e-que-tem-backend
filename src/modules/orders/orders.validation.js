import { celebrate, Joi } from 'celebrate';
import {
  MEAL_TYPES,
  DELIVERY_METHODS,
  PAYMENT_METHODS,
  PRODUCTS_CATEGORIES,
} from '../../shared/utils/constants.js';

// createOrder > '/orders'
const celebrateForCreateOrder = celebrate({
  body: Joi.object().keys({
    meal: Joi.string()
      .valid(...MEAL_TYPES)
      .required(),
    method: Joi.string()
      .valid(...DELIVERY_METHODS)
      .required(),
    payment: Joi.string()
      .valid(...PAYMENT_METHODS)
      .required(),

    customerSnapshot: Joi.object()
      .keys({
        userName: Joi.string()
          .min(2)
          .max(40)
          .pattern(/^[^<>]+$/)
          .required(),
        email: Joi.string().email().required(),
        tel: Joi.string()
          .min(14)
          .max(15)
          .pattern(/^\([1-9]{2}\)\s[0-9]?[0-9]{4}-[0-9]{4}$/)
          .required(),
      })
      .required(),

    addressSnapshot: Joi.object({
      address: Joi.string()
        .pattern(/^[^<>]*$/)
        .required(),

      number: Joi.string()
        .pattern(/^[a-zA-Z0-9\s]*$/)
        .required(),

      complement: Joi.string()
        .pattern(/^[a-zA-Z0-9\s.-]*$/)
        .required(),

      district: Joi.string()
        .pattern(/^[a-zA-ZÀ-ÿ0-9\s]*$/)
        .required(),

      cep: Joi.string()
        .length(9)
        .pattern(/^[0-9]{5}-[0-9]{3}$/)
        .required(),
    }).when('method', {
      is: 'delivery',
      then: Joi.required(),
    }), // addressSnapshot não é enviado para drive-thru

    itemsSnapshot: Joi.array()
      .items(
        Joi.object({
          _id: Joi.string().hex().length(24).required(),

          productName: Joi.string().required(),

          category: Joi.string()
            .valid(...PRODUCTS_CATEGORIES)
            .required(),

          partnerName: Joi.string().required(),
        }),
      )
      .min(1)
      .required(),

    obs: Joi.string()
      .allow('')
      .pattern(/^[^<>]*$/),
  }),
});

// getOrderByNumber > `/orders/:orderNumber` > Query: ?email=user@email.com
const celebrateForGetOrderByNumber = celebrate({
  params: Joi.object({
    orderNumber: Joi.string()
      .pattern(/^\d{12}$/)
      .required(),
  }),

  query: Joi.object({
    email: Joi.string().email().required(),
  }).unknown(false),
});

export { celebrateForCreateOrder, celebrateForGetOrderByNumber };
