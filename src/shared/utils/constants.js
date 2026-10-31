const PRODUCTS_CATEGORIES = [
  'carboidratos',
  'verduras-legumes',
  'leites-derivados',
  'carnes-ovos-peixes',
  'leguminosas-oleaginosas',
  'oleos-gorduras',
  'acucares-doces',
];

const MEAL_TYPES = ['sopa', 'creme', 'pate'];

const DELIVERY_METHODS = ['delivery', 'drive-thru'];

const PAYMENT_METHODS = ['pix', 'debito', 'credito'];

const SUBSCRIPTION_DURATIONS = ['two', 'four', 'six', 'twelve'];

const SUBSCRIPTION_DAYS = ['seg', 'ter', 'qua', 'qui', 'sex'];

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/; // garante HH:mm válido

export {
  PRODUCTS_CATEGORIES,
  MEAL_TYPES,
  DELIVERY_METHODS,
  PAYMENT_METHODS,
  SUBSCRIPTION_DURATIONS,
  SUBSCRIPTION_DAYS,
  TIME_REGEX,
};
