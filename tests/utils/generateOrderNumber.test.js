import generateOrderNumber from '../../src/shared/utils/generateOrderNumber.js';

// Testes unitários > generateOrderNumber
// Testa apenas a responsabilidade da função utilitária: gerar nº do pedido conforme tipo

describe('generateOrderNumber', () => {
  // 1
  it('Pedido avulso não deve começar com S', () => {
    const number = generateOrderNumber('orderType');

    expect(number.startsWith('S')).toBe(false);
  });

  // 2
  it('Pedido de assinatura deve começar com S', () => {
    const number = generateOrderNumber('subscriptionOrderType');

    expect(number.startsWith('S')).toBe(true);
  });

  // 3
  it('Pedido avulso deve conter 12 caracteres', () => {
    const number = generateOrderNumber('orderType');

    expect(number).toHaveLength(12);
  });

  // 4
  it('Pedido de assinatura deve conter 13 caracteres', () => {
    const number = generateOrderNumber('subscriptionOrderType');

    expect(number).toHaveLength(13);
  });

  // 5
  it('Pedido avulso deve conter apenas números', () => {
    const number = generateOrderNumber('orderType');

    expect(number).toMatch(/^\d{12}$/);
  });

  // 6
  it('Pedido de assinatura deve conter S seguido de números', () => {
    const number = generateOrderNumber('subscriptionOrderType');

    expect(number).toMatch(/^S\d{12}$/);
  });
});
