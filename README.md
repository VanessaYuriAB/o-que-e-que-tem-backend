<a id="top"></a>

# 🥣 O que é que tem? Na sopa, creme ou patê

![Node.js](https://img.shields.io/badge/Node.js_22_LTS-007ACC)
![JavaScript](https://img.shields.io/badge/JavaScript-007ACC)
![Express](https://img.shields.io/badge/Express-007ACC)
. ![MongoDB](https://img.shields.io/badge/MongoDB-007ACC)
![Mongoose](https://img.shields.io/badge/Mongoose-007ACC)
. ![JWT](https://img.shields.io/badge/JWT-007ACC)
![cookie-parser](https://img.shields.io/badge/cookie--parser-007ACC)
. ![dotenv](https://img.shields.io/badge/dotenv-007ACC)
![cross-env](https://img.shields.io/badge/cross--env-007ACC)
. ![CORS](https://img.shields.io/badge/CORS-007ACC)
![Helmet](https://img.shields.io/badge/Helmet-007ACC)
![Express Rate Limit](https://img.shields.io/badge/Express--Rate--Limit-007ACC)
. ![Winston](https://img.shields.io/badge/Winston-007ACC)
![Express Winston](https://img.shields.io/badge/Express--Winston-007ACC)
. ![Jest](https://img.shields.io/badge/Jest-007ACC)
![Supertest](https://img.shields.io/badge/Supertest-007ACC)
. ![EditorConfig](https://img.shields.io/badge/EditorConfig-007ACC)
![ESLint](https://img.shields.io/badge/ESLint-007ACC)
![Prettier](https://img.shields.io/badge/Prettier-007ACC)
![Husky](https://img.shields.io/badge/Husky-007ACC)
![lint-staged](https://img.shields.io/badge/lint--staged-007ACC)
. ![VS_Code_Workspace_Settings](https://img.shields.io/badge/VS_Code_Workspace_Settings-007ACC)

## Índice

1. [Descrição 📖](#-1-descrição)
2. [Tecnologias 🧰](#-2-tecnologias)
3. [Pré-requisitos ⚙️](#-3-pre-requisitos)
4. [Instalação 📥](#-4-instalação)
5. [Variáveis de ambiente 🔐](#-5-variáveis-de-ambiente)
6. [Como executar ▶️](#-6-como-executar)
7. [Scripts 📜](#-7-scripts)
8. [Testes 🧪](#-8-testes)
9. [Decisões técnicas 🧠](#-9-decisões-técnicas)
10. [Estrutura do projeto 🗃️](#-10-estrutura-do-projeto)
11. [Roadmap 🗺️](#-11-roadmap)

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

### Testes

- Jest
- Supertest

### Segurança e Autenticação

- helmet
- express-rate-limit
- bcryptjs
- jsonwebtoken
- cookie-parser

### Utilidades

- dotenv
- cross-env
- cors
- winston
- express-winston
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

O projeto utiliza arquivos de ambiente separados para cada contexto de execução:

- `.env.development`
- `.env.test`
- `.env.production`

O ambiente é definido pelos scripts do `package.json` através do `cross-env`.

Exemplo:

```json
"dev": "cross-env NODE_ENV=development nodemon server.js"
"test": "cross-env NODE_ENV=test node --experimental-vm-modules ./node_modules/jest/bin/jest.js --runInBand",
"start": "cross-env NODE_ENV=production node server.js"
```

> O projeto utiliza ECMAScript Modules (ESM). Por isso, o Jest é executado através do Node com a
> flag `--experimental-vm-modules`, permitindo compatibilidade com módulos ES durante a execução
> dos testes.

### ✔️ Variáveis obrigatórias

Todos os ambientes devem possuir as variáveis:

```
PORT=3001
MONGODB_URI=mongodb://localhost:27017
DB_NAME=oqueequetemdb
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX=100
JWT_SECRET=your-secret-key
```

### ✔️ Validação automática

Durante a inicialização da aplicação:

- o `NODE_ENV` é validado
- o arquivo `.env` correspondente é carregado automaticamente
- todas as variáveis obrigatórias são verificadas
- mensagens de erro específicas são geradas para configurações inválidas
- a aplicação é impedida de inicializar quando existe alguma inconsistência

Essa estratégia evita a execução da aplicação com configurações incompletas ou inválidas.

### ✔️ Centralização das configurações

A aplicação acessa variáveis de ambiente exclusivamente através do módulo `config/env.js`.

O uso direto de `process.env` é restrito à camada de configuração, reduzindo acoplamento e
centralizando validações.

O módulo também converte valores para seus tipos apropriados, como números e arrays, antes de
disponibilizá-los para a aplicação.

[Voltar ao topo 🔝](#top)

---

<a id="-6-como-executar"></a>

## ▶️ 6. Como executar

### Desenvolvimento

```bash
npm run dev
```

### Testes

- Executa todos os testes:

```bash
npm run test
```

- Executa os testes em modo observação:

```bash
npm run test:watch
```

- Gera relatório de cobertura:

```bash
npm run test:coverage
```

### Produção

```bash
npm run start
```

[Voltar ao topo 🔝](#top)

---

<a id="-7-scripts"></a>

## 📜 7. Scripts

| Script                | Descrição                                   |
| --------------------- | ------------------------------------------- |
| npm run dev           | Executa a aplicação em modo desenvolvimento |
| npm run test          | Executa os testes                           |
| npm run test:watch    | Executa os testes em modo observação        |
| npm run test:coverage | Gera relatório de cobertura dos testes      |
| npm run start         | Executa a aplicação em modo produção        |
| npm run lint          | Verifica problemas de lint                  |
| npm run lint:fix      | Corrige problemas de lint automaticamente   |
| npm run format        | Formata o código                            |
| npm run format:check  | Verifica formatação                         |
| npm run prepare       | Configura os hooks do Husky                 |

[Voltar ao topo 🔝](#top)

---

<a id="-8-testes"></a>

## 🧪 8. Testes

O projeto utiliza:

- Jest para testes unitários
- Supertest para testes de integração de rotas HTTP
- Mocks para validação isolada de middleware

Os testes são executados em ambiente isolado (`NODE_ENV=test`), utilizando o arquivo `.env.test`
(exceto `validateEnv` que utiliza objeto mockado).

Atualmente a suíte contempla testes para componentes de infraestrutura da aplicação, incluindo:

- validação de ambiente (`validateEnv`)
- middleware de rota inexistente (`notFoundPage`)
- middleware centralizado de tratamento de erros (`errorHandler`)
- middleware de rate limiting (`limiter`)

Além da infraestrutura, a suíte já contempla testes unitários dos modelos de domínio:

- User Model
- Subscription Model
- Product Model
- Partner Model
- Order Model
- SubscriptionOrder Model

### ✔️ Cobertura Atual

O `validateEnv` é um teste unitário puro que valida:

- presença das variáveis obrigatórias
- valores permitidos para `NODE_ENV`
- detecção de configurações inválidas
- geração de mensagens de erro apropriadas

O `notFoundPage` valida, com teste de integração:

- interceptação de rotas inexistentes
- retorno de `404 Not Found`
- estrutura padronizada da resposta de erro

O `errorHandler` possui:

- testes unitários para validação dos códigos HTTP e mensagens retornadas, incluindo erros
  customizados da aplicação e erros de infraestrutura do Mongoose (`CastError` e `ValidationError`)
- testes de integração para validação do fluxo completo entre Express, roteamento e middleware de
  erro

O `limiter` possui teste de integração que valida:

- registro do middleware na aplicação
- bloqueio após o limite configurado de requisições
- propagação do `RateLimitError`
- integração com o middleware centralizado de tratamento de erros
- retorno da resposta HTTP `429 Too Many Requests`

O `User Model` possui testes unitários para validação de:

- campos obrigatórios (`required`)
- expressões regulares (`match`)
- validação customizada (`validator.isEmail()`)
- valor padrão (`default`)
- transformação automática de strings (`trim`)
- restrições de domínio definidas no schema (`minlength`, `maxlength`)
- validação de documento válido

O `Subscription Model` possui testes unitários para validação de:

- campos obrigatórios (`required`)
- valores permitidos por `enum`
- consistência entre dias selecionados (`daysOn`) e horários cadastrados (`schedules`)
- regra de consistência do domínio implementada através do `middleware de documento` para validação
  do Mongoose (`pre('validate')`)
- validação de documento válido

O `Product Model` possui testes unitários para validação de:

- campos obrigatórios (`required`)
- valores permitidos por `enum`
- limite mínimo (`min`)
- transformação automática de strings (`trim`)
- validação de documento válido

O `Partner Model` possui testes unitários para validação de:

- campos obrigatórios (`required`)
- validação customizada (`validator.isEmail()`)
- valores permitidos por `enum`
- restrição de domínio definida no schema (`minlength`)
- expressões regulares (`match`)
- transformação automática de strings (`trim`)
- validação de documento válido

O `Order Model` possui testes unitários para validação de:

- campos obrigatórios (`required`)
- valores permitidos por `enum`
- validação customizada (`validator.isEmail()`)
- limite mínimo (`min`)
- obrigatoriedade condicional dos dados de endereço conforme o método de entrega selecionado
- validação da estrutura dos snapshots persistidos no pedido (`customerSnapshot`, `addressSnapshot`
  e `itemsSnapshot`)
- validação de array não vazio para os itens do pedido
- validação do formato do número do pedido através de expressão regular (`match`)
- validação de documento válido

O `SubscriptionOrder Model` possui testes unitários para validação de:

- campos obrigatórios (`required`)
- valores permitidos por `enum`
- validação customizada (`validator.isEmail()`)
- obrigatoriedade condicional dos dados de endereço conforme o método de entrega selecionado
- validação da estrutura dos snapshots persistidos no pedido de assinatura (`customerSnapshot`,
  `addressSnapshot` e `itemsSnapshot`)
- validação de array não vazio para os itens do pedido
- validação do formato do número do pedido de assinatura através de expressão regular (`match`)
- validação do formato do horário de entrega através de expressão regular (`match`)
- validação da janela permitida de entrega (`10:45` até `19:45`) através de regra customizada do
  schema
- validação de documento válido

### ✔️ Estratégia

- Testes unitários para funções isoladas (configurações, utilitários, serviços e validações)
- Testes de integração para fluxos HTTP completos utilizando Supertest
- Configurações de infraestrutura com cobertura própria antes das funcionalidades de negócio

Para cenários de integração específicos, a suíte utiliza uma aplicação Express isolada para testes
(`tests/helpers/testApp.js`).

Essa aplicação registra apenas as rotas e middlewares necessários para os cenários em validação,
evitando dependência da configuração completa da aplicação e reduzindo o acoplamento entre os testes
e o ambiente de execução.

[Voltar ao topo 🔝](#top)

---

<a id="-9-decisões-técnicas"></a>

## 🧠 9. Decisões técnicas

### ✔️ Arquitetura Feature-Based

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

### ✔️ ESM-first

O projeto utiliza ECMAScript Modules (ESM) como padrão.

Benefícios:

- Sintaxe padrão do JavaScript moderno
- Melhor compatibilidade com ferramentas atuais (Vite, ESLint)
- Melhor integração com TypeScript, para possível evolução
- Compatibilidade com ecossistemas frontend modernos (React)
- Facilidade de compartilhamento de código entre aplicações (backend e frontend)
- Compatibilidade com bibliotecas ESM-only (muitos pacotes novos já são ESM-first ou ESM-only)

Convenções adotadas:

- Imports locais utilizam extensões explícitas (`.js`)
- Uso de `import` e `export` em vez de `require` e `module.exports`

Exemplo: 

```js
import app from './app.js';
import connectDb from './config/database.js';
```

### ✔️ ESLint

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

### ✔️ Express 5

O projeto utiliza Express 5.

Controllers assíncronos não utilizam wrappers como `asyncHandler` porque o Express 5 já captura
automaticamente:

- exceções lançadas em funções async
- rejeições de Promises

e encaminha o erro para o middleware centralizado de tratamento de erros.

### ✔️ Configuração de ambiente

O projeto utiliza arquivos `.env` separados por ambiente. O carregamento é realizado dinamicamente
com `dotenv`, utilizando o valor de `NODE_ENV`.

O valor de `NODE_ENV` é definido exclusivamente pelos scripts do projeto através do `cross-env`.

Exemplo:

```json
"dev": "cross-env NODE_ENV=development nodemon server.js"
```

Benefícios:

- Separação clara entre ambientes
- Menor risco de configuração incorreta
- Padronização entre sistemas operacionais
- Falha imediata em caso de configuração inválida

Além do carregamento automático dos arquivos de ambiente, a aplicação centraliza todas as variáveis
em um módulo de configuração (`config/env.js`).

Esse módulo é responsável por:

- carregar o arquivo `.env` correspondente ao ambiente atual
- validar a configuração através de `validateEnv.js`
- converter valores para os tipos apropriados
- exportar um objeto único de configuração para toda a aplicação

Essa abordagem evita o uso direto de `process.env` espalhado pelo código, centralizando o acesso às
configurações da aplicação.

### ✔️ Banco de dados

A aplicação estabelece a conexão com o MongoDB durante a inicialização.

A camada de conexão possui responsabilidade exclusiva de estabelecer a conexão com o banco de dados.

O tratamento de falhas de inicialização foi centralizado no ponto de entrada da aplicação
(`server.js`), que é responsável por:

- inicializar a aplicação
- registrar erros de startup
- interromper a execução em caso de falha

Essa abordagem reduz acoplamento, melhora a reutilização da camada de banco de dados e facilita a
execução de testes.

### ✔️ Tratamento de erros

A aplicação utiliza um middleware centralizado para tratamento de erros durante o ciclo de vida das
requisições HTTP.

Erros de infraestrutura gerados pelo Mongoose são traduzidos para respostas HTTP apropriadas:

- `CastError` → `400 Bad Request`
- `ValidationError` → `400 Bad Request`

A aplicação utiliza, também, classes de erro customizadas para representar regras de negócio e
respostas HTTP específicas:

- `ConflictError`
- `ForbiddenError`
- `NotFoundError`
- `RateLimitError`
- `UnauthorizedError`

Cada classe define seu próprio código de status HTTP, permitindo tratamento consistente e
centralizado dos erros da aplicação.

Além dos erros gerados pela aplicação e pelo Mongoose:

- requisições para rotas inexistentes são tratadas por um middleware dedicado, retornando
  `404 Not Found`; e
- erros de validação produzidos pelo Celebrate/Joi são interceptados pelo middleware `errors()`,
  retornando respostas `400 Bad Request` adequadas.

O comportamento do middleware centralizado de tratamento de erros é validado por testes unitários
(Jest) e testes de integração (Supertest), garantindo a correta tradução dos erros internos da
aplicação e do Mongoose para respostas HTTP padronizadas.

### ✔️ CORS

A aplicação utiliza o middleware `cors` com lista de origens permitidas definida por variável de
ambiente.

A configuração possui as seguintes características:

- suporte a múltiplas origens através da variável `CORS_ORIGIN`
- validação dinâmica da origem da requisição
- suporte a credenciais (`credentials: true`)
- tratamento de requisições preflight (`OPTIONS`)
- bloqueio explícito de origens não autorizadas com resposta apropriada

Requisições sem cabeçalho `Origin` (como Curl, Postman e alguns testes automatizados)
são permitidas.

### ✔️ Helmet

A API utiliza Helmet com a configuração padrão para adicionar cabeçalhos HTTP relacionados à
segurança.

Entre os cabeçalhos adicionados estão:

- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Strict-Transport-Security`

Como a aplicação atua apenas como API REST e não entrega páginas HTML, a configuração padrão do
Helmet é suficiente para o cenário atual.

### ✔️ Rate Limiting

A aplicação utiliza `express-rate-limit` para limitar o número de requisições por endereço IP em uma
janela de tempo configurável.

Características:

- limite configurado por variável de ambiente (`RATE_LIMIT_MAX`)
- proteção contra abuso de endpoints
- mitigação básica contra ataques de força bruta e negação de serviço
- tratamento centralizado através da classe `RateLimitError`
- retorno de `429 Too Many Requests` quando o limite é excedido

A configuração atual utiliza uma janela de 15 minutos.

### ✔️ Observabilidade

A aplicação utiliza Winston para centralização de logs e Express-Winston para registro automático de
requisições HTTP.

Características:

- logs estruturados em formato JSON
- separação entre logs de aplicação, erros e requisições
- persistência em arquivos
- exibição em console durante o desenvolvimento
- integração com o pipeline de middlewares do Express

Arquivos gerados:

- `logs/app.log`: eventos gerais da aplicação
- `logs/error.log`: erros registrados pela aplicação
- `logs/request.log`: requisições HTTP processadas pelo servidor

O diretório `logs/` é criado localmente e não é versionado pelo Git.

Durante o desenvolvimento, os logs também são exibidos no terminal para facilitar a depuração.

Essa abordagem centraliza a observabilidade da aplicação e evita o uso direto de
`console.log`, `console.warn` e `console.error` no código de produção.

### ✔️ Modelagem de dados

O projeto adota uma abordagem model-first.

As entidades principais do domínio são modeladas e validadas através do Mongoose antes da
implementação dos controllers e rotas.

Essa estratégia permite:

- definir relacionamentos e regras de negócio antecipadamente;
- validar restrições de persistência diretamente nos modelos;
- criar testes unitários dos modelos antes da implementação das funcionalidades;
- reduzir retrabalho durante o desenvolvimento das features.

As validações de entrada HTTP não são implementadas nessa etapa. Elas são desenvolvidas junto de
cada funcionalidade através do Celebrate/Joi, acompanhando a definição dos endpoints da API.

### ✔️ Validação em camadas

A aplicação utiliza duas camadas complementares de validação:

1. Mongoose

Responsável por validar regras de domínio e persistência:

- tipos de dados;
- campos obrigatórios;
- enumerações;
- validações customizadas;
- consistência entre propriedades do documento.

2. Celebrate/Joi

Responsável por validar dados recebidos pelas rotas HTTP:

- `req.body`;
- `req.params`;
- `req.query`;
- `req.headers.`

Essa abordagem evita validações manuais dentro dos controllers e garante que as requisições cheguem
à lógica de negócio já validadas.

### 🚧 Autenticação

A autenticação planejada para a aplicação utilizará JWT armazenado em cookies `httpOnly`.

Características:

- `httpOnly`
- `Secure`
- `SameSite=Lax` ou `SameSite=Strict`

Essa abordagem reduz a exposição do token a ataques de XSS quando comparada ao armazenamento em
Local Storage.

[Voltar ao topo 🔝](#top)

---

<a id="-10-estrutura-do-projeto"></a>

## 🗃️ 10. Estrutura do projeto

```
├── .husky/
│    └── pre-commit
├── .vscode/
│    ├── extensions.json
│    └── settings.json
├── docs/
│    └── images/
├── src/
│    ├── config/
│    │    ├── cors.js
│    │    ├── database.js
│    │    ├── env.js
│    │    └── validateEnv.js
│    ├── modules/
│    │    ├── auth/
│    │    ├── contact/
│    │    ├── menu/
│    │    ├── orders/
│    │    ├── partners/
│    │    ├── recipes/
│    │    │    ├── recipes.controller.js
│    │    │    ├── recipes.model.js
│    │    │    ├── recipes.routes.js
│    │    │    ├── recipes.service.js
│    │    │    └── recipes.validation.js
│    │    ├── subscriptions/
│    │    └── users/
│    ├── shared/
│    │    ├── errors/
│    │    │    ├── ConfigError.js
│    │    │    ├── ConflictError.js
│    │    │    ├── ForbiddenError.js
│    │    │    ├── NotFoundError.js
│    │    │    ├── RateLimitError.js
│    │    │    └── UnauthorizedError.js
│    │    ├── logger/
│    │    │    └── logger.js
│    │    ├── middlewares/
│    │    │    ├── errorHandler.js
│    │    │    ├── errorLogger.js
│    │    │    ├── limiter.js
│    │    │    ├── notFoundPage.js
│    │    │    └── requestLogger.js
│    │    └── utils/
│    │         └── errorsMessages.js
│    └── app.js
├── tests/
│    ├── config/
│    │    └── validateEnv.test.js
│    ├── helpers/
│    │    └── testApp.js
│    ├── middlewares/
│    │    ├── errorHandler.test.js
│    │    ├── limiter.test.js
│    │    └── notFoundPage.test.js
│    ├── models/
│    │    ├── order.model.test.js
│    │    ├── partner.model.test.js
│    │    ├── product.model.test.js
│    │    ├── subscription-order.model.test.js
│    │    ├── subscription.model.test.js
│    │    └── user.model.test.js
│    └── routes/
│         └── testRoutes.js
├── .editorconfig
├── .env.example
├── .gitignore
├── .npmrc
├── .nvmrc
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── jest.config.js
├── package.json
└── server.js
```

### Diretórios principais

- `config`: carregamento de ambiente, validações de configuração, conexão com banco de dados e
  configurações de infraestrutura
- `modules`: módulos organizados por domínio de negócio
- `shared`: recursos compartilhados entre módulos
  - `errors`: classes de erros customizados da aplicação
  - `logger`: configuração centralizada de logs da aplicação
  - `middlewares`: middlewares reutilizáveis, incluindo tratamento centralizado de erros
  - `utils`: funções utilitárias compartilhadas
- `tests`: testes unitários, testes de integração, aplicação auxiliar de teste (`testApp`) e
  rotas específicas para cenários de validação

### Estrutura dos módulos

Cada módulo concentra seus próprios arquivos:

- `.controller.js`: controladores das rotas, recebe a requisição do frontend e, quando necessário,
  chama o service
- `.middleware.js`: middlewares específicos do módulo, quando necessário
- `.model.js`: modelos do MongoDB para persistência de dados
- `.routes.js`: definição das rotas
- `.service.js`: lógica de negócio e integrações externas quando necessário
- `.validation.js`: validação dos dados recebidos do frontend

[Voltar ao topo 🔝](#top)

---

<a id="-11-roadmap"></a>

## 🗺️ 11. Roadmap

Infraestrutura Base → Segurança → Observabilidade → Qualidade Base → Modelagem de Dados →
Autenticação → Funcionalidades Core → Qualidade → Documentação → Deploy

### ✅ Fase 1: Infraestrutura Base

#### Projeto

- [x] Configuração NVM (`.nvmrc`)
- [x] Configuração NPM (`.npmrc`)
- [x] Configuração do `package.json`
- [x] Configuração `.gitignore`
- [x] Configuração `.editorconfig`
- [x] Estrutura e arquitetura inicial do projeto (orientada a features)
- [x] README inicial

#### Qualidade de Código

- [x] Configuração ESLint
- [x] Configuração Prettier
- [x] Configuração Husky
- [x] Configuração lint-staged

#### Ambiente

- [x] Configuração dinâmica de ambientes (dotenv)
- [x] Validação centralizada de configuração (`validateEnv.js`)
- [x] Configuração cross-env
- [x] Configuração de scripts dev/start

#### Servidor

- [x] Configuração Nodemon
- [x] Configuração do Express
- [x] Configuração MongoDB
- [x] Classes de erros customizadas
- [x] Tratamento centralizado de erros (`errorHandler.js`)
- [x] Middleware de rotas inexistentes (404)
- [x] Middleware para erros do Celebrate/Joi

### ✅ Fase 2: Segurança

- [x] CORS
- [x] Helmet
- [x] Rate Limiting

### ✅ Fase 3: Observabilidade

- [x] Configuração do Winston
- [x] Logs de erros
- [x] Logs de requisições HTTP

### ✅ Fase 4: Qualidade Base

#### Configuração

- [x] Configuração do Jest
- [x] Configuração do Supertest
- [x] Configuração de cobertura de testes

#### Testes de componentes de infraestrutura

- [x] `validateEnv`
- [x] `notFoundPage`
- [x] `errorHandler` (unitários e integração)
- [x] `limiter`

### 🚧 Fase 5: Modelagem de Dados

#### Schemas (Mongoose)

- [x] Model/User
- [x] Model/Subscription
- [x] Model/Product
- [x] Model/Order
- [x] Model/SubscriptionOrder
- [ ] Model/Message
- [x] Model/Partner
- [ ] Model/TodayRecipe

#### Testes Unitários - Models (Jest)

- [x] User Model
- [x] Subscription Model
- [x] Product Model
- [x] Order Model
- [x] SubscriptionOrder Model
- [ ] Message Model
- [x] Partner Model
- [ ] TodayRecipe Model

### 🚧 Fase 6: Autenticação

#### Validação de Entrada - Requisições HTTP - Rotas (Celebrate/Joi)

- [ ] `auth.validation.js`

#### Autenticação

- [ ] Cadastro de usuário
- [ ] Hash de senha (bcrypt)
- [ ] Configuração cookie-parser
- [ ] Login
- [ ] Geração de JWT
- [ ] Middleware de autenticação
- [ ] Refresh Token
- [ ] Logout

#### Autorização

- [ ] Controle de permissões (Roles)

#### Testes de Integração (Supertest)

- [ ] Cadastro de usuário
- [ ] Login
- [ ] Middleware de autenticação
- [ ] Refresh Token
- [ ] Logout

### 🚧 Fase 7: Funcionalidades Core

#### Validações de Entrada - Requisições HTTP - Rotas (Celebrate/Joi)

- [ ] `users.validation.js`
- [ ] `subscriptions.validation.js`
- [ ] `menu.validation.js`
- [ ] `orders.validation.js`
- [ ] `contact.validation.js`
- [ ] `partners.validation.js`
- [ ] `recipes.validation.js`

#### Usuários

- [ ] Visualizar perfil
- [ ] Atualizar perfil

#### Assinaturas

- [ ] Ativar assinatura
- [ ] Pausar assinatura
- [ ] Criar pedido de assinatura
- [ ] Localizar pedido de assinatura
- [ ] Histórico de pedidos de assinatura

#### Cardápio

- [ ] Gestão de itens do cardápio
- [ ] Categorias
- [ ] Controle de disponibilidade

#### Pedidos

- [ ] Criar pedido
- [ ] Localizar pedido
- [ ] Histórico de pedidos

#### Fale Conosco

- [ ] Cadastro de mensagens
- [ ] Histórico de mensagens

#### Mercados Parceiros

- [ ] Inscrição de parceria

#### Receitas

- [ ] Busca de receitas
- [ ] Filtros de receitas
- [ ] Persistência de receitas

#### Integrações Externas

- [ ] Integração com API de CEP
- [ ] Integração com API de envio de e-mail/WhatsApp
- [ ] Integração com API de receitas

#### Testes de Integração (Supertest)

- [ ] Perfil de usuário
- [ ] Assinaturas
- [ ] Cardápio
- [ ] Pedidos
- [ ] Fale Conosco
- [ ] Mercados Parceiros
- [ ] Receitas

### 🚧 Fase 8: Integrações Externas Extras

- [ ] API de clima
- [ ] API de mapa

#### Testes de Integração (Supertest)

- [ ] Integração API de clima
- [ ] Integração API de mapa

### 🚧 Fase 9: Qualidade

#### Testes Unitários (Jest)

- [ ] Services
- [ ] Validators
- [ ] Utilitários

### 🚧 Fase 10: Documentação

- [ ] README final
- [ ] README técnico
- [ ] Coleção Postman

### 🚀 Fase 11: Deploy

#### Infraestrutura

- [ ] Migração MongoDB Local → MongoDB Atlas
- [ ] Ambiente de produção
- [ ] Variáveis de ambiente de produção

#### Deploy

- [ ] Render

### 📚 Melhorias Futuras

- [ ] Documentação com Swagger/OpenAPI

---

[Voltar ao topo 🔝](#top)
