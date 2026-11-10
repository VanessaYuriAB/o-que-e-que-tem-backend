import calculateOrderAmount from '../../../src/modules/orders/orders.pricing.js';

// Testes unitários > calculateOrderAmount
// Testa apenas a responsabilidade da função utilitária: preço conforme refeição + forma de entrega

describe('calculateOrderAmount', () => {
  // 1
  it('Sopa drive-thru', () => {
    expect(calculateOrderAmount('sopa', 'drive-thru')).toBe(25);
  });

  // 2
  it('Sopa delivery', () => {
    expect(calculateOrderAmount('sopa', 'delivery')).toBe(35);
  });

  // 3
  it('Creme retirada', () => {
    expect(calculateOrderAmount('creme', 'drive-thru')).toBe(30);
  });

  // 4
  it('Creme delivery', () => {
    expect(calculateOrderAmount('creme', 'delivery')).toBe(40);
  });

  // 5
  it('Patê retirada', () => {
    expect(calculateOrderAmount('pate', 'drive-thru')).toBe(35);
  });

  // 6
  it('Patê delivery', () => {
    expect(calculateOrderAmount('pate', 'delivery')).toBe(45);
  });
});
