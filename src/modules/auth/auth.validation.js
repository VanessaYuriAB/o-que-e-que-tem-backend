import { celebrate, Joi } from 'celebrate';

// register > '/auth/register'
const celebrateForRegister = celebrate({
  body: Joi.object().keys({
    userName: Joi.string()
      .required()
      .min(2)
      .max(40)
      .pattern(/^[^<>]+$/)
      .trim(),

    email: Joi.string().required().email().trim(),

    confirmEmail: Joi.string().valid(Joi.ref('email')).required().messages({
      'any.only': 'Os e-mails devem ser iguais',
    }),

    tel: Joi.string()
      .required()
      .min(14)
      .max(15)
      .pattern(/^\([1-9]{2}\)\s[0-9]?[0-9]{4}-[0-9]{4}$/)
      .trim(),

    password: Joi.string()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .trim(),

    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'As senhas devem ser iguais',
      }),
  }),
});

// login > '/auth/login'
const celebrateForLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().trim(),

    tel: Joi.string()
      .required()
      .min(14)
      .max(15)
      .pattern(/^\([1-9]{2}\)\s[0-9]?[0-9]{4}-[0-9]{4}$/)
      .trim(),

    password: Joi.string()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .trim(),
  }),
});

// refresh - user ('/auth/me'), refresh - token ('/auth/access') e logout ('/auth/logout')
// Exigem autenticação com refreshToken (identidade) - cookie httpOnly
const celebrateForRefreshToken = celebrate({
  cookies: Joi.object({
    refreshToken: Joi.string()
      .required()
      .pattern(/^[\w-]+\.[\w-]+\.[\w-]+$/), // valida formato padrão do JWT,
  }).unknown(true),
});

// Rotas privadas
// Exigem autenticação com accessToken (crachá) - cookie httpOnly
const celebrateForAccessToken = celebrate({
  cookies: Joi.object({
    accessToken: Joi.string()
      .required()
      .pattern(/^[\w-]+\.[\w-]+\.[\w-]+$/), // valida formato padrão do JWT
  }).unknown(true),
});

export {
  celebrateForRegister,
  celebrateForLogin,
  celebrateForRefreshToken,
  celebrateForAccessToken,
};
