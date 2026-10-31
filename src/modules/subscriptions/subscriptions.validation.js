import { celebrate, Joi } from 'celebrate';
import {
  SUBSCRIPTION_DAYS,
  DELIVERY_METHODS,
  TIME_REGEX,
  SUBSCRIPTION_DURATIONS,
  PAYMENT_METHODS,
} from '../../shared/utils/constants.js';

// createSubscription > '/subscriptions'
const celebrateForCreateSubscription = celebrate({
  body: Joi.object().keys({
    userName: Joi.string()
      .pattern(/^[^<>]+$/)
      .trim(),
    email: Joi.string().email().trim(),
    confirmEmail: Joi.string().valid(Joi.ref('email')).required().messages({
      'any.only': 'Os e-mails devem ser iguais',
    }),
    tel: Joi.string()
      .min(14)
      .max(15)
      .pattern(/^\([1-9]{2}\)\s[0-9]?[0-9]{4}-[0-9]{4}$/)
      .trim(),

    howLong: Joi.string()
      .valid(...SUBSCRIPTION_DURATIONS)
      .required(),
    daysOn: Joi.array()
      .items(Joi.string().valid(...SUBSCRIPTION_DAYS))
      .unique()
      .required(),
    schedules: Joi.object({
      seg: Joi.string().pattern(TIME_REGEX),
      ter: Joi.string().pattern(TIME_REGEX),
      qua: Joi.string().pattern(TIME_REGEX),
      qui: Joi.string().pattern(TIME_REGEX),
      sex: Joi.string().pattern(TIME_REGEX),
    })
      .required()
      .unknown(false),
    method: Joi.string()
      .valid(...DELIVERY_METHODS)
      .required(),

    cep: Joi.string()
      .pattern(/^[0-9]{5}-[0-9]{3}$/)
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
    infoText: Joi.string()
      .pattern(/^[^<>]+$/)
      .trim(),

    pay: Joi.string()
      .valid(...PAYMENT_METHODS)
      .required(),
  }),
});

// getSubscriptionOrderByNumber > `/subscriptions/orders/:subscriptionOrderNumber` > Query:
// ?email=user@email.com

// sendSubscriptionOrderToServer > '/subscriptions/orders'

export { celebrateForCreateSubscription };
