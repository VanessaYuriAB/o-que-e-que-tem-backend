import { celebrate, Joi } from 'celebrate';

// updateUserProfile > '/users/me'
const celebrateForUpdateUser = celebrate({
  body: Joi.object()
    .keys({
      userName: Joi.string()
        .pattern(/^[^<>]+$/)
        .trim(),
      email: Joi.string().email().trim(),
      tel: Joi.string()
        .min(14)
        .max(15)
        .pattern(/^\([1-9]{2}\)\s[0-9]?[0-9]{4}-[0-9]{4}$/)
        .trim(),
      address: Joi.string()
        .pattern(/^[^<>]+$/)
        .trim(),
      number: Joi.string()
        .pattern(/^[a-zA-Z0-9\s]*$/)
        .trim(),
      complement: Joi.string()
        .pattern(/^[a-zA-Z0-9\s.-]*$/)
        .trim(),
      district: Joi.string()
        .pattern(/^[a-zA-ZÀ-ÿ0-9\s]*$/)
        .trim(),
      cep: Joi.string()
        .pattern(/^[0-9]{5}-[0-9]{3}$/)
        .trim(),
      infoText: Joi.string()
        .pattern(/^[^<>]+$/)
        .trim(),
    })
    .min(1), // impede chamadas vazias: {} (endpoint de atualização parcial)
});

// updateSubscriptionProfile > '/users/subscriptions/me'

// getOrdersByUserId > '/users/:userId/orders'

// getSubscriptionOrdersByUserId > '/users/:userId/subscriptions/orders'

// getMessagesByUserId > '/users/:userId/messages'

export { celebrateForUpdateUser };
