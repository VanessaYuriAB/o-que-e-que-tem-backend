<a id="top"></a>

# 🥣 O que é que tem? Na sopa, creme ou patê

![Node.js](https://img.shields.io/badge/Node.js_20_LTS-007ACC)
![JavaScript](https://img.shields.io/badge/JavaScript-007ACC)
![Express](https://img.shields.io/badge/Express-007ACC)
![MongoDB](https://img.shields.io/badge/MongoDB-007ACC)
![JWT](https://img.shields.io/badge/JWT-007ACC)
![cookie-parser](https://img.shields.io/badge/cookie--parser-007ACC)

![EditorConfig](https://img.shields.io/badge/EditorConfig-007ACC)
![ESLint](https://img.shields.io/badge/ESLint-007ACC)
![Prettier](https://img.shields.io/badge/Prettier-007ACC)
![Husky](https://img.shields.io/badge/Husky-007ACC)
![lint-staged](https://img.shields.io/badge/lint--staged-007ACC)

![VS_Code_Workspace_Settings](https://img.shields.io/badge/VS_Code_Workspace_Settings-007ACC)

## Índice

1. [Descrição 📖](#-1-descrição)
2. [Tecnologias 🧰](#-2-tecnologias)
3. [Pré-requisitos ⚙️](#-3-pre-requisitos)
4. [Instalação 📥](#-4-instalação)
5. [Variáveis de ambiente 🔐](#-5-variáveis-de-ambiente)
6. [Como executar ▶️](#-6-como-executar)
7. [Scripts 📜](#-7-scripts)
8. [Decisões técnicas 🧠](#-8-decisões-técnicas)
9. [Estrutura do projeto 🗃️](#-9-estrutura-do-projeto)
10. [Roadmap 🗺️](#-10-roadmap)

<a id="-1-descrição"></a>

## 📖 1. Descrição

API REST para uma plataforma sustentável com assinatura flexível, gestão de pedidos e redução do
desperdício de alimentos por meio do aproveitamento de produtos próximos ao vencimento.

[Voltar ao topo 🔝](#top)

---

<a id="-2-tecnologias"></a>

## 🧰 2. Tecnologias

### Runtime e Framework

- Node.js
- JavaScript
- Express 5

### Banco de Dados

- MongoDB
- Mongoose

### Qualidade de Código

- ESLint 9 (Flat Config)
- Prettier
- Husky
- lint-staged

### Segurança e Autenticação

- helmet
- express-rate-limit
- bcryptjs
- jsonwebtoken
- cookie-parser

### Utilidades

- dotenv
- cors
- celebrate
- validator

[Voltar ao topo 🔝](#top)

---

<a id="-3-pre-requisitos"></a>

## ⚙️ 3. Pré-requisitos

- Node.js 22.23.3
- npm 10+
- MongoDB (instância local ou Atlas)

### NVM

Este projeto utiliza o arquivo `.nvmrc`.

Versão utilizada:

```bash
22.23.3
```

Caso utilize `nvm-windows`:

```bash
nvm use 22.23.3
```

[Voltar ao topo 🔝](#top)

---

<a id="-4-instalação"></a>

## 📥 4. Instalação

```bash
git clone git@github.com:VanessaYuriAB/o-que-e-que-tem-backend.git
cd o-que-e-que-tem-backend
npm install
```

> O exemplo utiliza clonagem via `SSH`.

[Voltar ao topo 🔝](#top)

---

<a id="-5-variáveis-de-ambiente"></a>

## 🔐 5. Variáveis de ambiente

Crie um arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```

Ou copie manualmente o conteúdo do arquivo `.env.example` e preencha os valores necessários antes
de iniciar a aplicação.

[Voltar ao topo 🔝](#top)

---

<a id="-6-como-executar"></a>

## ▶️ 6. Como executar

```bash
npm run dev
```

[Voltar ao topo 🔝](#top)

---

<a id="-7-scripts"></a>

## 📜 7. Scripts

| Script               | Descrição                                   |
| -------------------- | ------------------------------------------- |
| npm run dev          | Executa a aplicação em modo desenvolvimento |
| npm run start        | Executa a aplicação                         |
| npm run lint         | Verifica problemas de lint                  |
| npm run lint:fix     | Corrige problemas de lint automaticamente   |
| npm run format       | Formata o código                            |
| npm run format:check | Verifica formatação                         |
| npm run prepare      | Configura os hooks do Husky                 |

[Voltar ao topo 🔝](#top)

---

<a id="-8-decisões-técnicas"></a>

## 🧠 8. Decisões técnicas

### Arquitetura Feature-Based

O backend adota uma arquitetura orientada a features (domínios de negócio).

Em vez de organizar arquivos por camadas técnicas globais (como controllers, models e routes), cada
módulo concentra os artefatos relacionados à sua responsabilidade.

Exemplo:

```
modules/
└── recipes/
    ├── recipes.controller.js
    ├── recipes.model.js
    ├── recipes.routes.js
    ├── recipes.service.js
    └── recipes.validation.js
```

Benefícios:

- Melhor organização por domínio de negócio
- Maior facilidade de manutenção
- Maior escalabilidade para novas funcionalidades
- Menor acoplamento entre módulos
- Consistência com a arquitetura do frontend

### ESM-first

O projeto utiliza ECMAScript Modules (ESM) como padrão.

Benefícios:

- Sintaxe padrão do JavaScript moderno
- Melhor compatibilidade com ferramentas atuais (Vite, ESLint)
- Melhor integração com TypeScript, para possível evolução
- Compatibilidade com ecossistemas frontend modernos (React)
- Facilidade de compartilhamento de código entre aplicações (backend e frontend)
- Compatibilidade com bibliotecas ESM-only (muitos pacotes novos já são ESM-first ou ESM-only)

### Express 5

O projeto utiliza Express 5.

Controllers assíncronos não utilizam wrappers como `asyncHandler` porque o Express 5 já captura automaticamente:

- exceções lançadas em funções async
- rejeições de Promises

e encaminha o erro para o middleware centralizado de tratamento.

### ESLint

O projeto utiliza ESLint 9 com Flat Config.

Não foi adotado ESLint 10 devido à incompatibilidade atual do `eslint-plugin-import`.

Exemplo de regras adotadas, alinhadas à filosofia Airbnb:

```js
{
 eqeqeq: 'error',
 curly: 'error',
 'prefer-const': 'error',
 'no-var': 'error',
 'object-shorthand': 'error',
 'prefer-template': 'error',
}
```

### Autenticação

A autenticação é baseada em JWT armazenado em cookies HttpOnly.

Características:

- HttpOnly
- Secure
- SameSite=Lax ou SameSite=Strict

Essa abordagem reduz a exposição do token a ataques de XSS quando comparada ao armazenamento em
Local Storage.

[Voltar ao topo 🔝](#top)

---

<a id="-9-estrutura-do-projeto"></a>

## 🗃️ 9. Estrutura do projeto

```
├── .husky/
├    └── pre-commit
├── .vscode/
├    ├── extensions.json
├    └── settings.json
├── docs/
├    └── images/
├── src/
├    ├── config/
├    ├── modules/
├    ├    ├── auth/
├    ├    ├── contact/
├    ├    ├── menu/
├    ├    ├── orders/
├    ├    ├── partners/
├    ├    ├── recipes/
├    ├    ├    ├── recipes.controller.js
├    ├    ├    ├── recipes.model.js
├    ├    ├    ├── recipes.routes.js
├    ├    ├    ├── recipes.service.js
├    ├    ├    └── recipes.validation.js
├    ├    ├── subscriptions/
├    ├    └── users/
├    ├── shared/
├    ├    ├── errors/
├    ├    ├── middlewares/
├    ├    └── utils/
├    └── app.js
├── tests/
├── .editorconfig
├── .env.example
├── .gitignore
├── .npmrc
├── .nvmrc
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── package.json
└── server.js
```

### Diretórios principais

- `config`: configurações da aplicação
- `modules`: módulos organizados por domínio de negócio
- `shared`: recursos compartilhados entre módulos
- `errors`: tratamento centralizado de erros
- `middlewares`: middlewares reutilizáveis
- `utils`: funções utilitárias compartilhadas
- `tests`: testes automatizados

### Estrutura dos módulos

Cada módulo concentra seus próprios arquivos:

- `.controller.js`: controladores das rotas, recebe a requisição do frontend e, quando necessário,
  chama o service
- `.model.js`: modelos do MongoDB para persistência de dados
- `.routes.js`: definição das rotas
- `.service.js`: integração com API externa
- `.validation.js`: validação dos dados recebidos do frontend

[Voltar ao topo 🔝](#top)

---

<a id="-10-roadmap"></a>

## 🗺️ 10. Roadmap

### Infraestrutura

- [x] Estrutura inicial do projeto
- [x] Configuração ESLint
- [x] Configuração Prettier
- [x] Configuração Husky
- [x] Configuração MongoDB
- [ ] Testes automatizados
- [ ] Documentação da API
- [ ] Deploy

### Funcionalidades

- [ ] Sistema de autenticação
- [ ] Gestão de usuários
- [ ] Gestão de assinaturas
- [ ] Gestão de pedidos
- [ ] Cardápio
- [ ] Mercados parceiros
- [ ] Fale Conosco
- [ ] Receitas
- [ ] Integração com APIs externas

[Voltar ao topo 🔝](#top)
