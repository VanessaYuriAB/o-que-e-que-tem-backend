const MEAL_PRICES = {
  sopa: 25,
  creme: 30,
  pate: 35,
};

const DELIVERY_FEE = 10;

const calculateOrderAmount = (meal, method) =>
  MEAL_PRICES[meal] + (method === 'delivery' ? DELIVERY_FEE : 0);

export default calculateOrderAmount;
