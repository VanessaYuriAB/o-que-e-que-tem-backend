// Supertest
import supertest from 'supertest';
// Express test service
import testApp from '../helpers/testApp.js';
// Utils
import errorsMessages from '../../src/shared/utils/errorsMessages.js';

// Request to test
const request = supertest(testApp);

// Teste de integração
// request > express-rate-limit (limiter.js) > RateLimitError > errorHandler > 429 + mensagem correta
// Valida que o middleware está registrado, RateLimitError está sendo lançado, errorHandler está funcionando e a resposta final é 429

describe('Rate Limit', () => {
  const TEST_LIMIT = 5; // qtdd 'max' definida em tests/helpers/testApp.js

  it('deve retornar 429 após exceder o limite', async () => {
    const requests = [];

    for (let i = 0; i < TEST_LIMIT + 2; i++) {
      requests.push(request.get('/health'));
    }

    const responses = await Promise.all(requests);

    const blockedResponse = responses.find(
      (response) => response.status === 429,
    );

    expect(blockedResponse).toBeDefined();
    expect(blockedResponse.body).toHaveProperty('message');
    expect(blockedResponse.body.message).toBe(
      `${errorsMessages.rateLimit} Tente novamente em 15 minutos.`,
    );
  });
});
