import authModule from '../modules/auth/auth.index.js';
import adminModule from '../modules/admin/admin.index.js';
import usersModule from '../modules/users/users.index.js';
import subscriptionsModule from '../modules/subscriptions/subscriptions.index.js';

// Índice de roteamento da aplicação

const modules = [authModule, adminModule, usersModule, subscriptionsModule];

export default modules;
