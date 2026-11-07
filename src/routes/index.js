import authModule from '../modules/auth/auth.index.js';
import adminModule from '../modules/admin/admin.index.js';
import usersModule from '../modules/users/users.index.js';
import subscriptionsModule from '../modules/subscriptions/subscriptions.index.js';
import menuModule from '../modules/menu/menu.index.js';
import contactModule from '../modules/contact/contact.index.js';
import partnersModule from '../modules/partners/partners.index.js';

// Índice de roteamento da aplicação

const modules = [
  authModule,
  adminModule,
  usersModule,
  subscriptionsModule,
  menuModule,
  contactModule,
  partnersModule,
];

export default modules;
