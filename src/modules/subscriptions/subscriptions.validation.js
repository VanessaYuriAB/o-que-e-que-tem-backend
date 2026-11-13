import { celebrate, Joi } from 'celebrate';
import {
  SUBSCRIPTION_DAYS,
  DELIVERY_METHODS,
  TIME_REGEX,
  SUBSCRIPTION_DURATIONS,
  PAYMENT_METHODS,
  MEAL_TYPES,
  PRODUCTS_CATEGORIES,
} from '../../shared/utils/constants.js';

// createSubscription > '/subscriptions'
const celebrateForCreateSubscription = celebrate({
  body: Joi.object().keys({
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

    pay: Joi.string()
      .valid(...PAYMENT_METHODS)
      .required(),
  }),
});

// createSubscriptionOrder > '/subscriptions/orders'
const celebrateForCreateSubscriptionOrder = celebrate({
  body: Joi.object().keys({
    meal: Joi.string()
      .valid(...MEAL_TYPES)
      .required(),
    method: Joi.string()
      .valid(...DELIVERY_METHODS)
      .required(),

    day: Joi.date().required(),

    time: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .custom((value, helpers) => {
        const [hour, minute] = value.split(':').map(Number);

        const current = hour * 60 + minute;
        const min = 10 * 60 + 45; // 10:45
        const max = 19 * 60 + 45; // 19:45

        if (current < min || current > max) {
          return helpers.error('any.invalid');
        }

        return value;
      })
      .messages({
        'string.pattern.base': 'O horário deve estar no formato HH:mm.',
        'any.invalid': 'O horário deve estar entre 10:45 e 19:45.',
      })
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

// getSubscriptionOrderByNumber > `/subscriptions/orders/:subscriptionOrderNumber` > Query:
// ?email=user@email.com

export { celebrateForCreateSubscription, celebrateForCreateSubscriptionOrder };
