import router from './admin.routes.js';

// Exporta o módulo de admin com o prefixo da rota e seu roteador
// Registra o módulo para montagem automática das rotas da aplicação para que o agregador de módulos consiga rodar o forEach sem conhecer os detalhes de cada feature

export default {
  path: '/admin',
  router,
};
