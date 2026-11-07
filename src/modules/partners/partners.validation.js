import { celebrate, Joi } from 'celebrate';

// registerPartner > '/partners'
const celebrateForRegisterPartner = celebrate({
  body: Joi.object().keys({
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

    contactMethod: Joi.string().valid('email', 'tel'),

    companyName: Joi.string()
      .pattern(/^[^<>]+$/)
      .required(),
    cnpj: Joi.string()
      .min(14)
      .max(18)
      .pattern(
        /^([A-Z0-9]{12}[0-9]{2}|[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-[0-9]{2})$/,
      )
      .required(),
    cep: Joi.string()
      .min(8)
      .max(9)
      .pattern(/^[0-9]{5}-?[0-9]{3}$/)
      .required(),

    address: Joi.string().pattern(/^[^<>]+$/),
    numberAddress: Joi.string().pattern(/^[a-zA-Z0-9\s]*$/),
    complementAddress: Joi.string().pattern(/^[a-zA-Z0-9\s.-]*$/),
    district: Joi.string().pattern(/^[a-zA-ZÀ-ÿ0-9\s]*$/),
  }),
});

export default celebrateForRegisterPartner;
