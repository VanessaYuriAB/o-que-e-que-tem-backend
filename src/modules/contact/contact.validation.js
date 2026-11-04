import { celebrate, Joi } from 'celebrate';

// registerUserMsg > '/messages'
const celebrateForRegisterUserMsg = celebrate({
  body: Joi.object().keys({
    userName: Joi.string()
      .min(2)
      .max(40)
      .pattern(/^[^<>]+$/)
      .required(),
    email: Joi.string().email().required(),
    whatsapp: Joi.string()
      .min(14)
      .max(15)
      .pattern(/^\([1-9]{2}\)\s[0-9]?[0-9]{4}-[0-9]{4}$/)
      .required(),
    message: Joi.string()
      .pattern(/^[^<>]+$/)
      .required(),
    method: Joi.string().valid('email', 'whatsapp').required(),
  }),
});

export default celebrateForRegisterUserMsg;
