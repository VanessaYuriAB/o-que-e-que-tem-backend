// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../src/app.js';
// Utils
import env from '../../src/config/env.js';
import errorsMessages from '../../src/shared/utils/errorsMessages.js';

// Request to test
const request = supertest(app);

// Teste de integração
// request > express-rate-limit (limiter.js) > RateLimitError > errorHandler > 429 + mensagem correta
// Valida que o middleware está registrado, RateLimitError está sendo lançado, errorHandler está funcionando e a resposta final é 429

describe('Rate Limit', () => {
  it('deve retornar 429 após exceder o limite', async () => {
    const requests = [];

    for (let i = 0; i < env.RATE_LIMIT_MAX + 2; i++) {
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
