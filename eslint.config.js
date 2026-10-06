import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,

  {
    files: ['**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      import: importPlugin,
    },

    rules: {
      // Regras alinhadas à filosofia Airbnb, ainda atuais
      eqeqeq: 'error', // impede comparar valores com == e !=, exige sempre === e !==
      curly: 'error', // obriga uso de chaves em if, else, for, while etc, evita bugs em blocos de uma única linha
      'prefer-const': 'error', // Exige const quando a variável não é reatribuída
      'no-var': 'error', // Proíbe uso de var, incentiva uso de let e const
      'object-shorthand': 'error', // Exige shorthand em objetos, ex.: { name: name } -> { name }
      'prefer-template': 'error', // Exige template literals quando apropriado, ex.: 'Olá ' + nome -> `Olá ${nome}`

      // Ignora parâmetro "next" não utilizado em middlewares Express
      'no-unused-vars': ['error', { argsIgnorePattern: '^next$' }],

      // Permite uso de console para logs e debug no backend, quando sem configuração de um logger
      'no-console': 'off',

      // Permite underscore apenas para o _id do MongoDB
      'no-underscore-dangle': [
        'error',
        {
          allow: ['_id'],
        },
      ],

      // Detecta imports duplicados do mesmo módulo
      'import/no-duplicates': 'error',
      // Verifica se o caminho importado realmente existe, ex.: import User from './User.js'
      'import/no-unresolved': 'error',
    },
  },

  eslintConfigPrettier,
];
