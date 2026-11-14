import { celebrate, Joi } from 'celebrate';
import {
  SUBSCRIPTION_DAYS,
  DELIVERY_METHODS,
  TIME_REGEX,
} from '../../shared/utils/constants.js';

// updateUserProfile > '/users/me'
const celebrateForUpdateUser = celebrate({
  body: Joi.object()
    .keys({
      userName: Joi.string()
        .required()
        .min(2)
        .max(40)
        .pattern(/^[^<>]+$/)
        .trim(),
      email: Joi.string().required().email().trim(),
      tel: Joi.string()
        .required()
        .min(14)
        .max(15)
        .pattern(/^\([1-9]{2}\)\s[0-9]?[0-9]{4}-[0-9]{4}$/)
        .trim(),

      address: Joi.string()
        .allow('')
        .pattern(/^[^<>]*$/)
        .trim(),
      number: Joi.string()
        .allow('')
        .pattern(/^[a-zA-Z0-9\s]*$/)
        .trim(),
      complement: Joi.string()
        .allow('')
        .pattern(/^[a-zA-Z0-9\s.-]*$/)
        .trim(),
      district: Joi.string()
        .allow('')
        .pattern(/^[a-zA-ZÀ-ÿ0-9\s]*$/)
        .trim(),
      cep: Joi.string()
        .allow('')
        .pattern(/^$|^\d{5}-\d{3}$/)
        .trim(),

      infoText: Joi.string()
        .allow('')
        .pattern(/^[^<>]*$/)
        .trim(),
    })
    .min(1), // impede chamadas vazias: {} (endpoint de atualização parcial)
});

// updateSubscriptionProfile > '/users/subscriptions/me'
const celebrateForUpdateSubscription = celebrate({
  body: Joi.object()
    .keys({
      daysOn: Joi.array()
        .items(Joi.string().valid(...SUBSCRIPTION_DAYS))
        .unique(),

      schedules: Joi.object({
        seg: Joi.string().pattern(TIME_REGEX),
        ter: Joi.string().pattern(TIME_REGEX),
        qua: Joi.string().pattern(TIME_REGEX),
        qui: Joi.string().pattern(TIME_REGEX),
        sex: Joi.string().pattern(TIME_REGEX),
      }).unknown(false),

      method: Joi.string().valid(...DELIVERY_METHODS),

      status: Joi.boolean(),
    })
    .min(1), // impede chamadas vazias: {} (endpoint de atualização parcial)
});

// getOrdersByUserId > '/users/:userId/orders'
const celebrateForGetUserOrders = celebrate({
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
});

// getSubscriptionOrdersByUserId > '/users/:userId/subscriptions/orders'

// getMessagesByUserId > '/users/:userId/messages'
const celebrateForGetUserMsgs = celebrate({
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
});

export {
  celebrateForUpdateUser,
  celebrateForUpdateSubscription,
  celebrateForGetUserMsgs,
  celebrateForGetUserOrders,
};
