// Supertest
import supertest from 'supertest';
// Express test service
import app from '../../src/app.js';
// Utils
import errorsMessages from '../../src/shared/utils/errorsMessages.js';

// Request to test
const request = supertest(app);

// Teste de integração
// request > notFoundPage > NotFoundError > errorHandler > resposta 404

describe('notFoundPage', () => {
  it('deve responder com status 404 para rotas inexistentes', async () => {
    const response = await request.get('/rota-inexistente');

    expect(response.type).toMatch(/json/);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(
      `${errorsMessages.notFound} A página não foi encontrada, é um endereço inexistente.`,
    );
  });
});
