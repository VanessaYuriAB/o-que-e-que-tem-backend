<a id="top"></a>

# 🥣 O que é que tem? Na sopa, creme ou patê

![Node.js](https://img.shields.io/badge/Node.js_22_LTS-007ACC)
![JavaScript](https://img.shields.io/badge/JavaScript-007ACC)
![Express](https://img.shields.io/badge/Express-007ACC) .
![MongoDB](https://img.shields.io/badge/MongoDB-007ACC)
![Mongoose](https://img.shields.io/badge/Mongoose-007ACC) .
![JWT](https://img.shields.io/badge/JWT-007ACC)
![cookie-parser](https://img.shields.io/badge/cookie--parser-007ACC) .
![dotenv](https://img.shields.io/badge/dotenv-007ACC)
![cross-env](https://img.shields.io/badge/cross--env-007ACC) .
![CORS](https://img.shields.io/badge/CORS-007ACC)
![Helmet](https://img.shields.io/badge/Helmet-007ACC)
![Express Rate Limit](https://img.shields.io/badge/Express--Rate--Limit-007ACC)
. ![Celebrate](https://img.shields.io/badge/Celebrate-007ACC)
![Joi](https://img.shields.io/badge/Joi-007ACC) .
![Winston](https://img.shields.io/badge/Winston-007ACC)
![Express Winston](https://img.shields.io/badge/Express--Winston-007ACC) .
![Jest](https://img.shields.io/badge/Jest-007ACC)
![Supertest](https://img.shields.io/badge/Supertest-007ACC) .
![EditorConfig](https://img.shields.io/badge/EditorConfig-007ACC)
![ESLint](https://img.shields.io/badge/ESLint-007ACC)
![Prettier](https://img.shields.io/badge/Prettier-007ACC)
![Husky](https://img.shields.io/badge/Husky-007ACC)
![lint-staged](https://img.shields.io/badge/lint--staged-007ACC) .
![VS_Code_Workspace_Settings](https://img.shields.io/badge/VS_Code_Workspace_Settings-007ACC)
. ![Resend](https://img.shields.io/badge/Resend-007ACC)

## Índice

1. [Descrição 📖](#-1-descrição)
2. [Tecnologias 🧰](#-2-tecnologias)
3. [Pré-requisitos ⚙️](#-3-pre-requisitos)
4. [Instalação 📥](#-4-instalação)
5. [Variáveis de ambiente 🔐](#-5-variáveis-de-ambiente)
6. [Como executar ▶️](#-6-como-executar)
7. [Scripts 📜](#-7-scripts)
8. [Endpoints disponíveis 🌐](#-8-endpoints-disponíveis)
9. [Testes 🧪](#-9-testes)
10. [Decisões técnicas 🧠](#-10-decisões-técnicas)
11. [Estrutura do projeto 🗃️](#-11-estrutura-do-projeto)
12. [Roadmap 🗺️](#-12-roadmap)

<a id="-1-descrição"></a>

## 📖 1. Descrição

API REST para uma plataforma sustentável com assinatura flexível, gestão de
pedidos e redução do desperdício de alimentos por meio do aproveitamento de
produtos próximos ao vencimento.

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

### Infraestrutura HTTP

- cors
- cookie-parser

### Segurança e Autenticação

- helmet
- express-rate-limit
- bcryptjs
- jsonwebtoken

### Validação

- validator
- celebrate
- joi

### Utilidades

- dotenv
- cross-env
- winston
- express-winston

### Integrações Externas

- Resend

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

> O projeto utiliza ECMAScript Modules (ESM). Por isso, o Jest é executado
> através do Node com a flag `--experimental-vm-modules`, permitindo
> compatibilidade com módulos ES durante a execução dos testes.

### ✔️ Variáveis obrigatórias

Todos os ambientes devem possuir as variáveis:

```text
PORT=3001
MONGODB_URI=mongodb://localhost:27017
DB_NAME=oqueequetemdb
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX=100
JWT_SECRET=your-secret-key
RESEND_API_KEY=<resend-api-key>
RESEND_FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=<admin-email>
```

### ✔️ Validação automática

Durante a inicialização da aplicação:

- o `NODE_ENV` é validado
- o arquivo `.env` correspondente é carregado automaticamente
- todas as variáveis obrigatórias são verificadas
- mensagens de erro específicas são geradas para configurações inválidas
- a aplicação é impedida de inicializar quando existe alguma inconsistência

Essa estratégia evita a execução da aplicação com configurações incompletas ou
inválidas.

### ✔️ Centralização das configurações

A aplicação acessa variáveis de ambiente exclusivamente através do módulo
`config/env.js`.

O uso direto de `process.env` é restrito à camada de configuração, reduzindo
acoplamento e centralizando validações.

O módulo também converte valores para seus tipos apropriados, como números e
arrays, antes de disponibilizá-los para a aplicação.

### ✔️ Notificações por e-mail

O projeto utiliza o serviço Resend para envio de notificações administrativas.

Atualmente, o envio é utilizado pelos fluxos:

- cadastro de mensagens (`POST /messages`);
- cadastro de mercados parceiros (`POST /partners`).

Quando uma nova mensagem é criada com sucesso:

- a mensagem é persistida no MongoDB;
- uma notificação é enviada para o e-mail administrativo configurado em
  `ADMIN_EMAIL`;
- a mensagem enviada contém os dados cadastrais do responsável.

Quando uma nova solicitação de parceria é criada com sucesso:

- os dados da empresa são persistidos no MongoDB;
- uma notificação é enviada para o e-mail administrativo configurado em
  `ADMIN_EMAIL`;
- a mensagem enviada contém os dados cadastrais do responsável e da empresa.

Falhas no envio da notificação não impedem a persistência dos dados.

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

### Seed de produtos

O projeto disponibiliza scripts para popular a coleção de produtos com os dados
iniciais do cardápio.

Desenvolvimento:

```bash
npm run seed:products:dev
```

Produção:

```bash
npm run seed:products:prod
```

Os scripts utilizam a mesma estratégia de configuração de ambiente adotada pelo
restante da aplicação, definindo o `NODE_ENV` através do `cross-env` e
carregando automaticamente o arquivo `.env` correspondente.

> O seed foi criado para facilitar o desenvolvimento das funcionalidades do
> cardápio enquanto não existe uma interface administrativa para cadastro de
> produtos.

[Voltar ao topo 🔝](#top)

---

<a id="-7-scripts"></a>

## 📜 7. Scripts

| Script                     | Descrição                                        |
| -------------------------- | ------------------------------------------------ |
| npm run dev                | Executa a aplicação em modo desenvolvimento      |
| npm run test               | Executa os testes                                |
| npm run test:watch         | Executa os testes em modo observação             |
| npm run test:coverage      | Gera relatório de cobertura dos testes           |
| npm run start              | Executa a aplicação em modo produção             |
| npm run seed:products:dev  | Popula o cardápio no ambiente de desenvolvimento |
| npm run seed:products:prod | Popula o cardápio no ambiente de produção        |
| npm run lint               | Verifica problemas de lint                       |
| npm run lint:fix           | Corrige problemas de lint automaticamente        |
| npm run format             | Formata o código                                 |
| npm run format:check       | Verifica formatação                              |
| npm run prepare            | Configura os hooks do Husky                      |
| npm run logs:clear         | Limpa os arquivos de logs da aplicação           |

[Voltar ao topo 🔝](#top)

---

<a id="-8-endpoints-disponíveis"></a>

## 🌐 8. Endpoints disponíveis

- ### Auth

| Método | Rota           | Descrição                         |
| ------ | -------------- | --------------------------------- |
| POST   | /auth/register | Cadastro de usuário               |
| POST   | /auth/login    | Autenticação do usuário           |
| GET    | /auth/me       | Recuperação da sessão autenticada |
| POST   | /auth/access   | Renovação do accessToken          |
| POST   | /auth/logout   | Encerramento da sessão            |

- ### Users

| Método | Rota                    | Descrição                               |
| ------ | ----------------------- | --------------------------------------- |
| PATCH  | /users/me               | Atualização de perfil cadastral         |
| PATCH  | /users/subscriptions/me | Atualização do perfil de assinatura     |
| GET    | /users/:userId/orders   | Histórico de pedidos avulsos do usuário |
| GET    | /users/:userId/messages | Histórico de mensagens do usuário       |

- ### Admin

| Método | Rota          | Descrição                               |
| ------ | ------------- | --------------------------------------- |
| GET    | /admin/health | Validação de autorização administrativa |

- ### Subscriptions

| Método | Rota           | Descrição              |
| ------ | -------------- | ---------------------- |
| POST   | /subscriptions | Cadastro de assinatura |

- ### Menu

| Método | Rota  | Descrição                                        |
| ------ | ----- | ------------------------------------------------ |
| GET    | /menu | Recuperação dos produtos disponíveis do cardápio |

- ### Contact

| Método | Rota      | Descrição                       |
| ------ | --------- | ------------------------------- |
| POST   | /messages | Cadastro de mensagem do usuário |

- ### Partners

| Método | Rota      | Descrição                           |
| ------ | --------- | ----------------------------------- |
| POST   | /partners | Cadastro de solicitação de parceria |

- ### Orders

| Método | Rota                 | Descrição                 |
| ------ | -------------------- | ------------------------- |
| POST   | /orders              | Criação de pedido avulso  |
| GET    | /orders/:orderNumber | Consulta de pedido avulso |

> A documentação detalhada dos contratos HTTP será disponibilizada através da
> coleção Postman prevista no roadmap do projeto.

[Voltar ao topo 🔝](#top)

---

<a id="-9-testes"></a>

## 🧪 9. Testes

O projeto utiliza:

- Jest para testes unitários
- Supertest para testes de integração de rotas HTTP
- Mocks para isolamento de dependências externas e componentes de infraestrutura

Os testes são executados em ambiente isolado (`NODE_ENV=test`), utilizando o
arquivo `.env.test` (exceto `validateEnv` que utiliza objeto mockado).

Além do `validateEnv`, os testes de integração dos middlewares `errorHandler` e
`limiter` utilizam uma aplicação Express isolada (`tests/helpers/testApp.js`).

Essa aplicação registra apenas as rotas e middlewares necessários para os
cenários em validação, evitando dependência da configuração completa, reduzindo
o acoplamento entre os testes e garantindo cenários determinísticos para
validação da infraestrutura HTTP.

Para cenários que dependem de persistência, a suíte utiliza uma configuração
global do Jest (`tests/setup/jest.setup.js`) responsável pela preparação do
ambiente de banco de dados; incluindo conexão, limpeza das coleções para
garantia de isolamento entre os testes e encerramento da conexão ao final da
execução da suíte.

Atualmente a suíte contempla testes para componentes de infraestrutura da
aplicação, incluindo:

- validação de ambiente (`validateEnv`)
- middleware de rota inexistente (`notFoundPage`)
- middleware centralizado de tratamento de erros (`errorHandler`)
- middleware de rate limiting (`limiter`)

Além da infraestrutura, a suíte contempla testes unitários dos modelos de
domínio:

- User Model
- Subscription Model
- Product Model
- Partner Model
- Order Model
- SubscriptionOrder Model
- Message Model
- TodayRecipe Model

Além da infraestrutura e dos modelos, a suíte contempla testes de integração do
fluxo de autenticação e autorização:

- cadastro de usuário (`POST /auth/register`)
- login (`POST /auth/login`)
- middleware de autenticação (`GET /auth/health`)
- recuperação de sessão (`GET /auth/me`)
- renovação de sessão (`POST /auth/access`)
- logout (`POST /auth/logout`)
- middleware de autorização (`GET /admin/health`)

Além dos fluxos de autenticação e autorização, a suíte contempla testes de
integração da funcionalidade de gerenciamento de perfil do usuário:

- atualização de perfil cadastral (`PATCH /users/me`)
- atualização de perfil de assinatura (`PATCH /users/subscriptions/me`)
- recuperação do histórico de pedidos avulsos do usuário
  (`GET /users/:userId/orders`)
- recuperação do histórico de mensagens do usuário
  (`GET /users/:userId/messages`)

Além do gerenciamento de perfil, a suíte contempla testes de integração da
funcionalidade de assinaturas:

- criação de assinatura (`POST /subscriptions`)

Além das funcionalidades de assinatura, a suíte contempla testes de integração
das funcionalidades de cardápio, contato e mercados parceiros:

- busca de produtos do cardápio (`GET /menu`)
- cadastro de mensagens (`POST /messages`)
- inscrição de parceria (`POST /partners`)

Além dos testes de integração, as funcionalidades de contato e parceria possuem
testes unitários do serviço responsável pelo envio de notificações
administrativas por e-mail:

- `sendUserMsgNotificationToAdmin`
- `sendNewPartnerNotificationToAdmin`

Os fluxos de integração que acionam notificações administrativas utilizam mocks
do serviço compartilhado de e-mail (`email.service`), impedindo chamadas reais
ao Resend durante a execução dos testes.

Essa abordagem permite validar o acionamento da integração externa sem gerar
envios reais de e-mail, reduzindo dependências externas e tornando a suíte mais
rápida e previsível.

Além dos serviços, a suíte contempla testes de integração da funcionalidade de
pedidos avulsos:

- criação de pedido avulso (`POST /orders`)
- consulta de pedido avulso (`GET /orders/:orderNumber`)

Além das funcionalidades de pedidos avulsos, a suíte contempla testes unitários
dos utilitários:

- `generateOrderNumber`
- `calculateOrderAmount`

### ✔️ Cobertura Atual

O `notFoundPage` valida, com teste de integração:

- interceptação de rotas inexistentes
- retorno de `404 Not Found`
- estrutura padronizada da resposta de erro

O `errorHandler` possui:

- testes unitários para validação dos códigos HTTP e mensagens retornadas,
  incluindo erros customizados da aplicação e erros de infraestrutura do
  `Mongoose` (`CastError` e `ValidationError`)
- testes de integração para validação do fluxo completo entre Express,
  roteamento e middleware de erro

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
- restrições de domínio definidas no schema (`minlength`, `maxlength`)
- valores permitidos por `enum`
- validação de documento válido

O `Subscription Model` possui testes unitários para validação de:

- campos obrigatórios (`required`)
- valores permitidos por `enum`
- consistência entre dias selecionados (`daysOn`) e horários cadastrados
  (`schedules`)
- regra de consistência do domínio implementada através do
  `middleware de documento` para validação do `Mongoose` (`pre('validate')`)
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
- obrigatoriedade condicional dos dados de endereço conforme o método de entrega
  selecionado
- validação da estrutura dos snapshots persistidos no pedido
  (`customerSnapshot`, `addressSnapshot` e `itemsSnapshot`)
- validação de array não vazio para os itens do pedido
- validação do formato do número do pedido através de expressão regular
  (`match`)
- validação de documento válido, inclusive quando owner é `null`

O `SubscriptionOrder Model` possui testes unitários para validação de:

- campos obrigatórios (`required`)
- valores permitidos por `enum`
- validação customizada (`validator.isEmail()`)
- obrigatoriedade condicional dos dados de endereço conforme o método de entrega
  selecionado
- validação da estrutura dos snapshots persistidos no pedido de assinatura
  (`customerSnapshot`, `addressSnapshot` e `itemsSnapshot`)
- validação de array não vazio para os itens do pedido
- validação do formato do número do pedido de assinatura através de expressão
  regular (`match`)
- validação do formato do horário de entrega através de expressão regular
  (`match`)
- validação da janela permitida de entrega (`10:45` até `19:45`) através de
  regra customizada do schema
- validação de documento válido

O `Message Model` possui testes unitários para validação de:

- campos obrigatórios (`required`)
- valores padrão (`default`)
- validação customizada de e-mail através de `validator.isEmail()`
- validação de formato do WhatsApp através de expressão regular (`match`)
- validação de conteúdo permitido para `userName` e `message` através de
  expressões regulares (`match`)
- valores permitidos pelo campo `method` através de enumeração (`enum`)
- restrição de domínio definida no schema (`minlength`)
- validação de documentos contendo datas válidas (`Date`)
- validação de documento válido

O `TodayRecipe Model` possui testes unitários para validação de:

- campos obrigatórios (`required`)
- valores permitidos por `enum`
- validação de array não vazio para ingredientes
- validação de conteúdo permitido para ingredientes e modo de preparo através de
  expressões regulares (`match`)
- garantia da existência de exatamente três receitas por documento
- validação da presença de exatamente uma receita de cada tipo (Sopa, Creme e
  Patê)
- validação de documento válido

Os serviços `sendUserMsgNotificationToAdmin` e
`sendNewPartnerNotificationToAdmin` possuem testes unitários para validação de:

- montagem e disparo da notificação administrativa
- integração com o serviço compartilhado de e-mail (`email.service`)
- tratamento de falhas durante o envio da notificação
- registro de erros através da infraestrutura de logs da aplicação

Os testes utilizam mocks para as dependências externas (`email.service`) e para
o mecanismo de observabilidade (`logger`), permitindo validar o comportamento do
serviço de forma isolada.

O utilitário `generateOrderNumber` possui testes unitários para validação de:

- geração de pedidos avulsos
- geração de pedidos de assinatura
- prefixo utilizado para pedidos de assinatura (`S`)
- tamanho esperado dos identificadores gerados

O utilitário `calculateOrderAmount` possui testes unitários para validação de:

- precificação da sopa
- precificação do creme
- precificação do patê
- aplicação da taxa de entrega
- cálculo correto para pedidos `delivery`
- cálculo correto para pedidos `drive-thru`

O fluxo de cadastro de usuário (`POST /auth/register`) possui testes de
integração que validam:

- cadastro realizado com sucesso
- persistência dos dados no MongoDB
- verificação de e-mail duplicado
- hash da senha utilizando `bcryptjs`
- validação de e-mail inválido
- validação de senha inválida
- validação de divergência entre `password` e `confirmPassword`
- validação de corpo da requisição ausente
- rejeição de campos não permitidos na requisição (`role`)
- validação do cabeçalho `Content-Type`

O fluxo de login (`POST /auth/login`) possui testes de integração que validam:

- autenticação realizada com sucesso
- geração de `accessToken`
- geração de `refreshToken`
- envio dos tokens em cookies `httpOnly`
- validação de credenciais através do método `findUserByCredentials`
- validação de e-mail inexistente
- validação de senha incorreta
- validação de ausência dos campos obrigatórios (`required()`)
- validação do cabeçalho `Content-Type`

O middleware de autenticação (`accessMiddleware`) possui testes de integração
que validam:

- autenticação realizada com sucesso
- validação do payload autenticado disponibilizado em `req.user`, incluindo
  identificador do usuário (_id) e papel de acesso (role)
- validação de `accessToken` expirado
- validação de `accessToken` assinado com chave inválida
- validação de ausência do cookie `accessToken`
- validação de formato inválido do JWT

O fluxo de recuperação de sessão (`GET /auth/me`) possui testes de integração
que validam:

- recuperação da sessão existente através de `refreshToken`
- localização do usuário autenticado no MongoDB
- autenticação realizada com sucesso
- validação de `refreshToken` expirado
- validação de `refreshToken` assinado com chave inválida
- validação de ausência do cookie `refreshToken`
- validação de formato inválido do JWT
- integração entre Celebrate/Joi, `refreshMiddleware` e controller

O fluxo de renovação de sessão (`POST /auth/access`) possui testes de integração
que validam:

- renovação do `accessToken`
- envio de novo cookie `accessToken`
- configuração do cookie como `httpOnly`
- validação de `refreshToken` expirado
- validação de `refreshToken` assinado com chave inválida
- validação de ausência do cookie `refreshToken`
- validação de formato inválido do JWT
- integração entre Celebrate/Joi, `refreshMiddleware` e controller

O fluxo de logout (`POST /auth/logout`) possui testes de integração que validam:

- remoção dos cookies `accessToken` e `refreshToken`
- invalidação dos cookies através de `clearCookie`
- resposta HTTP de sucesso
- validação de ausência do cookie `refreshToken`
- validação de formato inválido do JWT

O middleware de autorização (`roleMiddleware`) possui testes de integração que
validam:

- acesso permitido para administradores
- bloqueio de acesso para usuários
- bloqueio de acesso para `role` ausente
- bloqueio de acesso para `role` não permitida

O fluxo de atualização de perfil cadastral (`PATCH /users/me`) possui testes de
integração que validam:

- atualização realizada com sucesso
- persistência dos dados atualizados no MongoDB
- retorno do documento atualizado
- ausência de exposição de campos sensíveis (`password`)
- validação de presença do cookie `accessToken`
- validação de formato inválido do JWT
- validação de `accessToken` expirado
- validação de `accessToken` assinado com chave inválida
- validação do cabeçalho `Content-Type`
- validação dos campos recebidos através do Celebrate/Joi
- localização do usuário autenticado através do identificador presente no JWT
- retorno de `404 Not Found` para usuário inexistente

O fluxo de criação de assinatura (`POST /subscriptions`) possui testes de
integração que validam:

- criação da assinatura com sucesso
- persistência dos dados da assinatura no MongoDB
- atualização do usuário com os vínculos de assinatura (`subscription` e
  `subscriptionDetails`)
- retorno do documento atualizado com `populate('subscriptionDetails')`
- ausência de exposição de campos sensíveis (`password`)
- validação de presença do cookie `accessToken`
- validação de formato inválido do JWT
- validação de `accessToken` expirado
- validação de `accessToken` assinado com chave inválida
- validação do cabeçalho `Content-Type`
- validação dos campos recebidos através do Celebrate/Joi
- validação dos campos obrigatórios (`required`)
- validação dos valores permitidos por enum (`enum`)
- validação de itens permitidos em `daysOn`
- validação de unicidade dos itens em `daysOn`
- validação da estrutura de `schedules`
- bloqueio de propriedades desconhecidas em `schedules`
- validação do formato dos horários através de expressão regular (`TIME_REGEX`)
- regra de consistência entre `daysOn` e `schedules` implementada através de
  middleware de documento do `Mongoose` (`pre('validate')`)
- prevenção de assinaturas duplicadas por proprietário (`409 Conflict`)

O fluxo de atualização de perfil de assinatura (`PATCH /users/subscriptions/me`)
possui testes de integração que validam:

- atualização da configuração da assinatura
- persistência dos dados atualizados no MongoDB
- retorno do documento atualizado com `populate('subscriptionDetails')`
- pausa de assinatura através do campo `status`
- persistência da alteração de status no MongoDB
- validação de presença do cookie `accessToken`
- validação de formato inválido do JWT
- validação de `accessToken` expirado
- validação de `accessToken` assinado com chave inválida
- validação do cabeçalho `Content-Type`
- validação dos campos recebidos através do Celebrate/Joi
- validação dos valores permitidos por enum (`enum`)
- validação de itens permitidos em `daysOn`
- validação de unicidade dos itens em `daysOn`
- validação da estrutura de `schedules`
- bloqueio de propriedades desconhecidas em `schedules`
- validação do formato dos horários através de expressão regular (`TIME_REGEX`)
- regra de consistência entre `daysOn` e `schedules` implementada através de
  middleware de documento do `Mongoose` (`pre('validate')`)
- validação de corpo de requisição vazio para atualização parcial
- localização da assinatura através do proprietário autenticado
- retorno de `404 Not Found` para assinatura inexistente

O fluxo de recuperação do histórico de pedidos avulsos do usuário
(`GET /users/:userId/orders`) possui testes de integração que validam:

- recuperação dos pedidos associados ao usuário autenticado
- retorno de coleção (`array`) contendo os documentos encontrados
- retorno dos campos esperados dos pedidos persistidos
- ordenação dos pedidos do mais recente para o mais antigo (`createdAt`
  decrescente)
- retorno de coleção vazia quando não existem pedidos cadastrados
- validação de presença do cookie `accessToken`
- validação de formato inválido do JWT
- validação do formato do parâmetro `userId`
- validação dos parâmetros da rota através do Celebrate/Joi
- validação de `accessToken` expirado
- validação de `accessToken` assinado com chave inválida
- bloqueio de acesso a pedidos pertencentes a outro usuário
- acesso permitido para administradores
- integração entre Celebrate/Joi, `accessMiddleware`,
  `isOwnerOrAdminMiddleware`, controller e MongoDB

O fluxo de recuperação do histórico de mensagens do usuário
(`GET /users/:userId/messages`) possui testes de integração que validam:

- recuperação das mensagens associadas ao usuário autenticado
- retorno de coleção (`array`) contendo os documentos encontrados
- retorno dos campos esperados das mensagens persistidas
- ordenação das mensagens do mais recente para o mais antigo (`createdAt`
  decrescente)
- retorno de coleção vazia quando não existem mensagens cadastradas
- validação de presença do cookie `accessToken`
- validação de formato inválido do JWT
- validação do formato do parâmetro `userId`
- validação dos parâmetros da rota através do Celebrate/Joi
- validação de `accessToken` expirado
- validação de `accessToken` assinado com chave inválida
- bloqueio de acesso a mensagens pertencentes a outro usuário
- acesso permitido para administradores
- integração entre Celebrate/Joi, `accessMiddleware`,
  `isOwnerOrAdminMiddleware`, controller e MongoDB

O fluxo de busca de menu (`GET /menu`) possui testes de integração que validam:

- recuperação apenas dos produtos disponíveis cadastrados
- ocultação automática dos produtos indisponíveis (`qtyAvailable <= 0`)
- ocultação automática de produtos com prazo de validade expirado
  (`availableUntil < data atual`)
- retorno da estrutura esperada da resposta HTTP
- retorno dos campos principais dos produtos
- retorno de lista vazia quando não existem produtos cadastrados
- integração entre Express, controller, rota e MongoDB

O fluxo de cadastro de mensagens (`POST /messages`) possui testes de integração
que validam:

- cadastro de mensagem realizado com sucesso para usuário previamente cadastrado
- persistência da mensagem vinculada ao proprietário (`owner`)
- cadastro de mensagem realizado com sucesso para usuário não cadastrado
- persistência da mensagem sem proprietário associado (`owner: null`)
- acionamento do serviço de notificação administrativa por e-mail através de
  mock do `email.service`
- validação do cabeçalho `Content-Type`
- validação dos campos obrigatórios (`required`)
- validação do tamanho mínimo e máximo dos campos, quando aplicável
- validação dos formatos permitidos através de expressões regulares (`match`)
- validação de e-mail através do Celebrate/Joi
- validação do formato do WhatsApp
- validação dos valores permitidos pelo campo `method`
- rejeição de conteúdos contendo caracteres HTML básicos (`<` e `>`)
- integração entre Express, rota, middleware de validação, controller e MongoDB

O fluxo de inscrição de parceria (`POST /partners`) possui testes de integração
que validam:

- cadastro realizado com sucesso
- persistência dos dados do parceiro no MongoDB
- acionamento do serviço de notificação administrativa por e-mail através de
  mock do `email.service`
- validação do cabeçalho `Content-Type`
- validação dos campos obrigatórios (`required`)
- validação dos tamanhos mínimos e máximos dos campos, quando aplicável
- validação dos formatos permitidos através de expressões regulares (`match`)
- validação de e-mail através do Celebrate/Joi
- validação dos valores permitidos pelo campo `contactMethod`
- rejeição de conteúdos contendo caracteres HTML básicos (`<` e `>`)
- prevenção de cadastro duplicado através do campo `cnpj`
- retorno de `409 Conflict` para CNPJ previamente cadastrado
- integração entre Express, rota, middleware de validação, controller, serviço
  de notificação e MongoDB

O fluxo de criação de pedidos avulsos (`POST /orders`) possui testes de
integração que validam:

- criação de pedido com sucesso para usuário previamente cadastrado
- associação automática do pedido ao proprietário (`owner`)
- criação de pedido com sucesso para visitante
- persistência do pedido sem proprietário associado (`owner: null`)
- geração automática do número do pedido
- cálculo automático do valor total do pedido no backend
- validação do cabeçalho `Content-Type`
- validação dos campos obrigatórios (`required`)
- validação dos valores permitidos por enum (`enum`)
- validação de formatos através de expressões regulares (`match`)
- validação de e-mail através do Celebrate/Joi
- validação condicional de endereço conforme o método de entrega
- suporte a pedidos `drive-thru` com ou sem endereço informado
- rejeição de conteúdos contendo caracteres HTML básicos (`<` e `>`)
- integração entre Express, rota, middleware de validação, controller e MongoDB

O fluxo de consulta de pedidos avulsos (`GET /orders/:orderNumber`) possui
testes de integração que validam:

- recuperação de pedido através do número do pedido e e-mail do cliente
- retorno do documento persistido no MongoDB
- retorno de `404 Not Found` para número de pedido inexistente
- retorno de `404 Not Found` para e-mail não associado ao pedido
- validação de obrigatoriedade do parâmetro de consulta (`email`)
- validação do formato do número do pedido
- validação do formato do e-mail
- bloqueio de parâmetros de consulta não permitidos
- integração entre Express, Celebrate/Joi, controller e MongoDB

### ✔️ Estratégia

- Testes unitários para funções isoladas (configurações, utilitários, serviços e
  validações)
- Utilização de mocks para isolar integrações externas e componentes de
  observabilidade durante testes unitários e cenários específicos de integração
- Utilização de mocks ESM (`jest.unstable_mockModule`) para módulos externos em
  projetos baseados em `ECMAScript Modules`
- Testes de integração para fluxos HTTP completos utilizando Supertest
- Integração entre Express, middlewares, validações e banco de dados quando
  aplicável
- Configurações de infraestrutura com cobertura própria antes das
  funcionalidades de negócio

[Voltar ao topo 🔝](#top)

---

<a id="-10-decisões-técnicas"></a>

## 🧠 10. Decisões técnicas

### ✔️ Arquitetura Feature-Based

O backend adota uma arquitetura orientada a features (domínios de negócio).

Ao invés de organizar arquivos por camadas técnicas globais (como controllers,
models e routes), cada módulo concentra os artefatos relacionados à sua
responsabilidade.

Exemplo:

```text
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

### ✔️ Agregação Automática de Rotas

Os módulos da aplicação expõem um objeto contendo o prefixo da rota e o
respectivo roteador.

Exemplo:

```js
export default {
  path: '/auth',
  router,
};
```

Todos os módulos são registrados por um agregador central de rotas, que realiza
a montagem automática na aplicação:

```js
modules.forEach(({ path, router }) => {
  app.use(path, router);
});
```

Benefícios:

- desacoplamento entre módulos e aplicação principal;
- registro centralizado de rotas;
- escalabilidade para novas features;
- menor necessidade de alterações em `app.js`.

### ✔️ ESM-first

O projeto utiliza `ECMAScript Modules` (ESM) como padrão.

Benefícios:

- Sintaxe padrão do JavaScript moderno
- Melhor compatibilidade com ferramentas atuais (Vite, ESLint)
- Melhor integração com TypeScript, para possível evolução
- Compatibilidade com ecossistemas frontend modernos (React)
- Facilidade de compartilhamento de código entre aplicações (backend e frontend)
- Compatibilidade com bibliotecas `ESM-only` (muitos pacotes novos já são
  `ESM-first` ou `ESM-only`)

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

Não foi adotado ESLint 10 devido à incompatibilidade atual do
`eslint-plugin-import`.

Exemplo de regras adotadas, alinhadas à filosofia `Airbnb`:

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

Controllers assíncronos não utilizam wrappers como `asyncHandler` porque o
Express 5 já captura automaticamente:

- exceções lançadas em funções `async`
- rejeições de Promises

e encaminha o erro para o middleware centralizado de tratamento de erros.

### ✔️ Configuração de ambiente

O projeto utiliza arquivos `.env` separados por ambiente. O carregamento é
realizado dinamicamente com `dotenv`, utilizando o valor de `NODE_ENV`.

O valor de `NODE_ENV` é definido exclusivamente pelos scripts do projeto através
do `cross-env`.

Exemplo:

```json
"dev": "cross-env NODE_ENV=development nodemon server.js"
```

Benefícios:

- Separação clara entre ambientes
- Menor risco de configuração incorreta
- Padronização entre sistemas operacionais
- Falha imediata em caso de configuração inválida

Além do carregamento automático dos arquivos de ambiente, a aplicação centraliza
todas as variáveis em um módulo de configuração (`config/env.js`).

Esse módulo é responsável por:

- carregar o arquivo `.env` correspondente ao ambiente atual
- validar a configuração através de `validateEnv.js`
- converter valores para os tipos apropriados
- exportar um objeto único de configuração para toda a aplicação

Essa abordagem evita o uso direto de `process.env` espalhado pelo código,
centralizando o acesso às configurações da aplicação.

### ✔️ Banco de dados

A aplicação estabelece a conexão com o MongoDB durante a inicialização.

A camada de conexão possui responsabilidade exclusiva de estabelecer a conexão
com o banco de dados.

O tratamento de falhas de inicialização foi centralizado no ponto de entrada da
aplicação (`server.js`), que é responsável por:

- inicializar a aplicação
- registrar erros de startup
- interromper a execução em caso de falha

Essa abordagem reduz acoplamento, melhora a reutilização da camada de banco de
dados e facilita a execução de testes.

### ✔️ Tratamento de erros

A aplicação utiliza um middleware centralizado para tratamento de erros durante
o ciclo de vida das requisições HTTP.

Erros de infraestrutura gerados pelo `Mongoose` são traduzidos para respostas
HTTP apropriadas:

- `CastError` → `400 Bad Request`
- `ValidationError` → `400 Bad Request`

Determinadas regras de domínio implementadas através de `ValidationError` do
`Mongoose` possuem mensagens específicas preservadas pela aplicação.

Exemplo:

- Os dias selecionados e os horários informados devem corresponder exatamente.

Essa estratégia permite que erros de consistência do domínio sejam apresentados
ao consumidor da API de forma mais clara do que as mensagens genéricas
utilizadas para falhas de validação comuns.

A aplicação utiliza, também, classes de erro customizadas para representar
regras de negócio e respostas HTTP específicas:

- `ConfigError`
- `ConflictError`
- `ForbiddenError`
- `NotFoundError`
- `RateLimitError`
- `UnauthorizedError`
- `UnsupportedMediaTypeError`

Cada classe define seu próprio código de status HTTP, permitindo tratamento
consistente e centralizado dos erros da aplicação.

Além dos erros gerados pela aplicação e pelo `Mongoose`:

- requisições para rotas inexistentes são tratadas por um middleware dedicado,
  retornando `404 Not Found`; e
- erros de validação produzidos pelo Celebrate/Joi são interceptados pelo
  middleware `errors()`, retornando respostas `400 Bad Request` adequadas.

O comportamento do middleware centralizado de tratamento de erros é validado por
testes unitários (Jest) e testes de integração (Supertest), garantindo a correta
tradução dos erros internos da aplicação e do `Mongoose` para respostas HTTP
padronizadas.

### ✔️ CORS

A aplicação utiliza o middleware `cors` com lista de origens permitidas definida
por variável de ambiente.

A configuração possui as seguintes características:

- suporte a múltiplas origens através da variável `CORS_ORIGIN`
- validação dinâmica da origem da requisição
- suporte a credenciais (`credentials: true`)
- tratamento de requisições preflight (`OPTIONS`)
- bloqueio explícito de origens não autorizadas com resposta apropriada

Requisições sem cabeçalho `Origin` (como Curl, Postman e alguns testes
automatizados) são permitidas.

### ✔️ Helmet

A API utiliza Helmet com a configuração padrão para adicionar cabeçalhos HTTP
relacionados à segurança.

Entre os cabeçalhos adicionados estão:

- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Strict-Transport-Security`

Como a aplicação atua apenas como API REST e não entrega páginas HTML, a
configuração padrão do Helmet é suficiente para o cenário atual.

### ✔️ Rate Limiting

A aplicação utiliza `express-rate-limit` para limitar o número de requisições
por endereço IP em uma janela de tempo configurável.

Características:

- limite configurado por variável de ambiente (`RATE_LIMIT_MAX`)
- proteção contra abuso de endpoints
- mitigação básica contra ataques de força bruta e negação de serviço
- tratamento centralizado através da classe `RateLimitError`
- retorno de `429 Too Many Requests` quando o limite é excedido

A configuração atual utiliza uma janela de 15 minutos.

### ✔️ Observabilidade

A aplicação utiliza Winston para centralização de logs e Express-Winston para
registro automático de requisições HTTP.

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

Durante o desenvolvimento, os logs também são exibidos no terminal para
facilitar a depuração.

Essa abordagem centraliza a observabilidade da aplicação e evita o uso direto de
`console.log`, `console.warn` e `console.error` no código de produção.

### ✔️ Modelagem de dados

O projeto adota uma abordagem `model-first`.

As entidades principais do domínio são modeladas e validadas através do
`Mongoose` antes da implementação dos controllers e rotas.

Essa estratégia permite:

- definir relacionamentos e regras de negócio antecipadamente;
- validar restrições de persistência diretamente nos modelos;
- criar testes unitários dos modelos antes da implementação das funcionalidades;
- reduzir retrabalho durante o desenvolvimento das features.

As validações de entrada HTTP não são implementadas nessa etapa. Elas são
desenvolvidas junto de cada funcionalidade através do Celebrate/Joi,
acompanhando a definição dos endpoints da API.

#### Auditoria básica com `timestamps`

Todos os schemas utilizam a opção:

```js
{
  timestamps: true,
}
```

O `Mongoose` passa a criar e atualizar automaticamente os campos:

- `createdAt`
- `updatedAt`

Isso elimina a necessidade de controle manual dessas informações e fornece uma
trilha básica de auditoria para os documentos persistidos.

#### Inicialização de dados (Seed)

Durante o desenvolvimento e implantação, o projeto disponibiliza scripts de seed
para cadastrar os produtos iniciais do cardápio no MongoDB.

O script é executado manualmente através de:

```bash
npm run seed:products:dev
npm run seed:products:prod
```

Essa estratégia facilita o desenvolvimento das funcionalidades relacionadas ao
cardápio enquanto as operações administrativas de cadastro e gerenciamento de
produtos ainda não estão disponíveis por meio da API ou da interface web.

### ✔️ Validação em camadas

A aplicação utiliza duas camadas complementares de validação:

1. `Mongoose`

Responsável por validar regras de domínio e persistência:

- tipos de dados;
- campos obrigatórios;
- enumerações;
- validações customizadas;
- consistência entre propriedades do documento.

Determinadas regras de consistência do domínio são implementadas diretamente nos
modelos do `Mongoose`.

Exemplo: o modelo de assinatura exige que todos os dias selecionados em `daysOn`
e todos os horários preenchidos em `schedules` representem exatamente os mesmos
dias.

Essa validação é executada através de um middleware de documento:

```js
schema.pre('validate');
```

permitindo validar a consistência entre propriedades do documento completo antes
da persistência no banco de dados.

Fluxo simplificado:

```text
Requisição HTTP
↓
Celebrate/Joi
↓
Controller
↓
Document Validation (Mongoose)
↓
pre('validate')
↓
Persistência
```

Essa abordagem evita validações manuais dentro dos controllers e garante que as
requisições cheguem à lógica de negócio já validadas.

2. Celebrate/Joi

Responsável por validar dados recebidos pelas rotas HTTP:

- `req.body`
- `req.params`
- `req.query`
- `req.cookies`

Além das validações simples de tipo e formato, o Celebrate/Joi também é
utilizado para aplicar validações condicionais.

Exemplo: pedidos com método de entrega (`delivery`) exigem o preenchimento do
objeto `addressSnapshot`. Pedidos para retirada local permitem, mas não exigem o
envio desses dados.

Essa regra é implementada através dos recursos de validação condicional do Joi:

```js
addressSnapshot: Joi.object(...).when('method', {
  is: 'delivery',
  then: Joi.required(),
});
```

permitindo adaptar as exigências da validação ao contexto específico da
requisição.

Validações de autenticação utilizam cookies `httpOnly`, permitindo verificar a
presença dos tokens esperados antes que a requisição alcance a camada de
negócio.

### ✔️ Validação de Content-Type

Endpoints que recebem JSON utilizam um middleware específico responsável por
validar o cabeçalho `Content-Type`.

A validação é realizada através de `req.is('application/json')`, separando
responsabilidades entre:

- Celebrate/Joi para dados da requisição;
- middleware HTTP para validações relacionadas ao protocolo.

Requisições incompatíveis recebem resposta `415 Unsupported Media Type`.

### ✔️ Autenticação

A autenticação é baseada em JWT armazenados em cookies `httpOnly`.

Após a validação das credenciais, a API gera dois tokens:

- `accessToken`: utilizado para acesso às rotas protegidas
- `refreshToken`: utilizado para renovação da sessão sem necessidade de novo
  login

Ambos os tokens são enviados ao navegador através dos cookies `httpOnly`.

Essa abordagem reduz a exposição dos tokens a ataques de `XSS` quando comparada
ao armazenamento em Local Storage, uma vez que cookies `httpOnly` não podem ser
acessados via JavaScript no navegador.

#### Configuração dos cookies

Exemplo simplificado:

```js
res.cookie('accessToken', accessToken, {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
  maxAge: 15 * 60 * 1000,
});
```

- ##### httpOnly

Impede que o cookie seja acessado através de JavaScript.

Exemplo bloqueado:

```js
document.cookie;
```

Essa configuração reduz a exposição dos tokens em caso de vulnerabilidades
`XSS`.

- ##### secure

Determina que o cookie só pode ser enviado através de conexões HTTPS.

Em produção:

```js
secure: true;
```

Em desenvolvimento:

```js
secure: false;
```

Isso permite testes locais utilizando `http://localhost:3000` sem necessidade de
HTTPS.

- ##### sameSite

Controla quando o navegador pode enviar cookies entre diferentes origens.

Desenvolvimento:

```js
sameSite: 'lax';
```

Produção:

```js
sameSite: 'none';
```

Como o frontend e o backend serão hospedados em domínios diferentes:

```text
Frontend:
https://<frontend>.vercel.app  

Backend:
https://<backend>.onrender.com
```

é necessário utilizar:

```js
sameSite: 'none';
```

juntamente com:

```js
secure: true;
```

para permitir o envio dos cookies nas requisições autenticadas.

- ##### path

Define para quais rotas o navegador deve enviar os cookies.

```js
path: '/';
```

permite que o navegador envie o cookie para todas as rotas da API.

Exemplos:

```text
/auth/login
/auth/me
/auth/access
/users/me
/orders
/subscriptions
```

Como a autenticação é utilizada em múltiplos endpoints, a aplicação utiliza `/`.

- ##### maxAge

Define o tempo de vida do cookie.

Exemplos:

```js
15 * 60 * 1000;
```

→ 15 minutos

```js
7 * 24 * 60 * 60 * 1000;
```

→ 7 dias

A aplicação utiliza:

```text
accessToken → 15 minutos
refreshToken → 7 dias
```

#### Integração com CORS

Como a autenticação utiliza cookies, tanto frontend quanto backend precisam
permitir o envio de credenciais.

Exemplo simplificado:

```js
app.use(cors(corsOptions));
```

A configuração permite o envio de credenciais e valida dinamicamente as origens
autorizadas definidas pela variável `CORS_ORIGIN`.

Frontend:

```js
fetch(url, {
  credentials: 'include',
});
```

Sem essa configuração o navegador não enviará nem armazenará os cookies de
autenticação.

#### Validação de entradas

A validação das entradas relacionadas à autenticação é realizada através do
Celebrate/Joi.

Existem validações para:

- cadastro de usuário (`register`)
- login
- presença do cookie `refreshToken`
- presença do cookie `accessToken`

#### Fluxos

- ##### Cadastro de usuário

O fluxo de cadastro possui:

- endpoint de registro (`POST /auth/register`)
- verificação de e-mail duplicado
- hash de senha utilizando `bcryptjs`
- resposta sanitizada sem exposição do hash da senha

Fluxo simplificado:

```text
1. Usuário envia nome, e-mail, telefone e senha

2. Backend valida os dados da requisição

3. Backend verifica se o e-mail já está cadastrado

4. Senha é convertida para hash utilizando bcryptjs

5. Usuário é persistido no MongoDB

6. Backend retorna os dados do usuário sem expor a senha
```

- ##### Login

O login é responsável por autenticar o usuário e iniciar a sessão.

Fluxo simplificado:

```text
1. Usuário envia e-mail, telefone e senha  

2. Backend valida os dados da requisição  

3. Backend localiza o usuário no banco de dados

4. As credenciais são validadas através do método findUserByCredentials() 

5. Backend gera:
  - accessToken (15 minutos)
  - refreshToken (7 dias)  

6. Tokens são enviados em cookies httpOnly  

7. Navegador armazena os cookies

8. Frontend passa a realizar requisições com: credentials: 'include'

9. Navegador envia os cookies automaticamente para a API

10. Rotas protegidas validam o accessToken

11. Quando o accessToken expira:
  - o fluxo de renovação da sessão será realizado através do refreshToken
```

Implementação atual:

```js
const accessToken = jwt.sign(
  { _id: userInDb._id, role: userInDb.role },
  env.JWT_SECRET,
  {
    expiresIn: '15m',
  },
);
const refreshToken = jwt.sign(
  { _id: userInDb._id, role: userInDb.role },
  env.JWT_SECRET,
  {
    expiresIn: '7d',
  },
);
```

Os tokens disponibilizados incluem o identificador do usuário (`_id`) e seu
papel de acesso (`role`), permitindo que middlewares de autorização realizem
verificações de permissões diretamente a partir do payload autenticado,
eliminando a necessidade de consultar o banco de dados para identificar o perfil
de acesso do usuário em cada requisição.

- ##### Rotas privadas (Access Middleware)

A autenticação das rotas privadas é realizada por um middleware dedicado
(`accessMiddleware`), responsável por:

- verificar a presença do cookie `accessToken`;
- validar a assinatura e expiração do JWT;
- disponibilizar o payload autenticado através de `req.user`;
- impedir o acesso a recursos protegidos quando o token é ausente ou inválido.

As rotas protegidas utilizam uma validação prévia através do Celebrate/Joi para
verificar a presença e o formato do token antes da validação criptográfica
realizada pelo middleware.

Fluxo simplificado:

```text
Login
↓
JWT gerado
↓
Cookie armazenado
↓
Cookie enviado para a rota protegida
↓
Celebrate valida presença e formato do JWT
↓
accessMiddleware executa
↓
jwt.verify() executa
↓
req.user recebe o payload
↓
Controller recebe o usuário autenticado
```

- ##### Recuperação e renovação de sessão (Refresh Middleware)

Além do middleware responsável pelas rotas protegidas (`accessMiddleware`), a
aplicação utiliza um middleware específico para fluxos baseados em
`refreshToken` (`refreshMiddleware`).

Esse middleware é responsável por:

- verificar a presença do cookie `refreshToken`;
- validar a assinatura e expiração do JWT;
- disponibilizar o payload autenticado através de `req.user`;
- impedir a recuperação ou renovação da sessão quando o token é ausente ou
  inválido.

Fluxo de recuperação da sessão:

```text
GET /auth/me
↓
Celebrate valida presença e formato do refreshToken
↓
refreshMiddleware executa
↓
jwt.verify() executa
↓
req.user recebe o payload
↓
Usuário é localizado no MongoDB
↓
Dados do usuário autenticado são retornados
```

Fluxo de renovação da sessão:

```text
POST /auth/access
↓
Celebrate valida presença e formato do refreshToken
↓
refreshMiddleware executa
↓
jwt.verify() executa
↓
req.user recebe o payload
↓
Novo accessToken é gerado
↓
Novo cookie accessToken é enviado
```

- ##### Logout

A aplicação disponibiliza um endpoint específico para encerramento da sessão:

```text
POST /auth/logout
```

O endpoint é responsável por remover os cookies utilizados pela autenticação:

- `accessToken`
- `refreshToken`

A invalidação ocorre através do método `clearCookie`, utilizando a mesma
configuração definida na criação dos cookies.

Fluxo simplificado:

```text
POST /auth/logout
↓
Celebrate valida presença e formato do refreshToken
↓
logoutUser executa
↓
accessToken removido
↓
refreshToken removido
↓
Sessão encerrada
```

Como o objetivo da rota é apenas remover os cookies armazenados no navegador,
não existe necessidade de validação criptográfica através do
`refreshMiddleware`.

Essa abordagem permite que a sessão seja encerrada mesmo quando os tokens já
estão expirados.

### ✔️ Autorização

#### Controle de acesso baseado em papéis (`roles`)

A aplicação utiliza controle de permissões baseado em papéis (`RBAC`).

Papéis atualmente suportados:

- `user`
- `admin`

O papel do usuário (`role`) é incluído no payload do JWT durante a autenticação
e disponibilizado através de `req.user`.

Rotas administrativas possuem um middleware específico de autorização
(`roleMiddleware`) responsável por validar se o usuário autenticado possui os
privilégios necessários para executar a operação solicitada.

Usuários sem permissão recebem resposta `403 Forbidden`.

#### Autorização por proprietário (Owner Access)

Além do controle baseado em papéis (`RBAC`), a aplicação disponibiliza um
middleware de autorização por proprietário (`isOwnerOrAdminMiddleware`).

Esse middleware permite que:

- administradores (`admin`) acessem qualquer recurso;
- usuários comuns (`user`) acessem apenas recursos associados ao próprio
  identificador.

A validação é realizada comparando o identificador do usuário autenticado
(`req.user._id`) com o parâmetro da rota (`req.params`).

Exemplo simplificado:

```js
GET /users/:id
```

Cenários:

```text
req.user._id === req.params.id
↓
Acesso permitido

req.user.role === 'admin'
↓
Acesso permitido

Demais casos
↓
403 Forbidden
```

A rota protegida também utiliza validação prévia dos parâmetros através do
Celebrate/Joi, garantindo que identificadores inválidos sejam rejeitados antes
da execução da camada de autenticação e autorização.

Fluxo:

```text
Celebrate
↓
accessMiddleware
↓
isOwnerOrAdminMiddleware
```

Essa abordagem permite proteger recursos pertencentes ao próprio usuário, como
perfil, histórico de pedidos e assinaturas, sem necessidade de criar regras
específicas em cada controller.

### ✔️ Usuários

#### Atualização de Perfil Cadastral

Usuários autenticados podem atualizar seus dados cadastrais através do endpoint:

```text
PATCH /users/me
```

A rota utiliza autenticação baseada em `accessToken` e validação de entrada
através do Celebrate/Joi.

Fluxo simplificado:

```text
PATCH /users/me
↓
Celebrate valida presença e formato do accessToken
↓
accessMiddleware executa
↓
jwt.verify() executa
↓
req.user recebe o payload autenticado
↓
validateContentType valida o Content-Type
↓
Celebrate/Joi valida os dados enviados
↓
Usuário é localizado através de req.user._id
↓
MongoDB atualiza o documento
↓
Documento atualizado é retornado
```

A atualização utiliza uma `whitelist` explícita para evitar alterações de campos
sensíveis não previstos pela aplicação.

#### Atualização de Perfil de Assinatura

Usuários autenticados podem atualizar a configuração da assinatura ou alterar
seu status através do endpoint:

```text
PATCH /users/subscriptions/me
```

A rota utiliza autenticação baseada em `accessToken`, validação de entrada
através do Celebrate/Joi e validações de domínio implementadas no `Mongoose`.

Fluxo simplificado:

```text
PATCH /users/subscriptions/me
↓
Celebrate valida presença e formato do accessToken
↓
accessMiddleware executa
↓
jwt.verify() executa
↓
req.user recebe o payload autenticado
↓
validateContentType valida o Content-Type
↓
Celebrate/Joi valida os dados enviados
↓
Controller localiza a assinatura do usuário autenticado
↓
Assinatura é atualizada
↓
Validação de documento do Mongoose executa
↓
Documento atualizado é persistido
↓
Usuário é recuperado com: populate('subscriptionDetails')
↓
Documento atualizado é retornado
```

A funcionalidade suporta dois cenários:

- atualização de configuração da assinatura:

  - `daysOn`
  - `schedules`
  - `method`

- alteração de status da assinatura:

  - ativação (`status: true`)
  - pausa (`status: false`)

Assim como na criação da assinatura, regras de consistência entre os dias
selecionados em `daysOn` e os horários informados em `schedules` são validadas
através de middleware de documento do `Mongoose`:

```js
schema.pre('validate');
```

garantindo que ambos representem exatamente os mesmos dias antes da persistência
no banco de dados.

#### Histórico de pedidos avulsos

Usuários autenticados podem consultar o histórico de pedidos associado a um
usuário através do endpoint:

```text
GET /users/:userId/orders
```

Fluxo simplificado:

```text
GET /users/:userId/orders
↓
Celebrate/Joi valida:
  - presença e formato do accessToken
  - formato do parâmetro userId
↓
accessMiddleware executa
↓
jwt.verify() executa
↓
req.user recebe o payload autenticado
↓
isOwnerOrAdminMiddleware valida acesso ao recurso
↓
MongoDB localiza pedidos associados ao proprietário
↓
Resposta HTTP 200 OK
```

Somente o proprietário dos pedidos ou um usuário com perfil administrativo pode
acessar o recurso.

Quando não existem pedidos cadastrados:

```json
[]
```

A ausência de pedidos não é tratada como erro, pois o recurso consultado é uma
coleção. Por esse motivo a API retorna `200 OK` juntamente com um array vazio.

#### Histórico de mensagens

Usuários autenticados podem consultar o histórico de mensagens associado a um
usuário através do endpoint:

```text
GET /users/:userId/messages
```

A rota utiliza autenticação baseada em `accessToken` e autorização por
proprietário através do middleware `isOwnerOrAdminMiddleware`.

Fluxo simplificado:

```text
GET /users/:userId/messages
↓
Celebrate/Joi valida:
  - presença e formato do accessToken
  - formato do parâmetro userId
↓
accessMiddleware executa
↓
jwt.verify() executa
↓
req.user recebe o payload autenticado
↓
isOwnerOrAdminMiddleware valida acesso ao recurso
↓
MongoDB localiza mensagens associadas ao proprietário
↓
Resposta HTTP 200 OK
```

O parâmetro `userId` é validado através do Celebrate/Joi antes da execução da
camada de autenticação e autorização.

A rota exige um identificador válido no formato `ObjectId` do MongoDB.

Exemplo:

```text
/users/6869ef6c3fbc2f6d0f4e6e6a/messages
```

Identificadores inválidos são rejeitados com resposta `400 Bad Request`.

Somente o proprietário das mensagens ou um usuário com perfil administrativo
pode acessar o recurso.

Quando existem mensagens cadastradas:

```json
[
  {
    "_id": "...",
    "owner": "...",
    "message": "..."
  }
]
```

Quando não existem mensagens cadastradas:

```json
[]
```

A ausência de mensagens não é tratada como erro, pois o recurso consultado é uma
coleção. Por esse motivo a API retorna `200 OK` juntamente com um array vazio.

### ✔️ Assinaturas

#### Cadastro de Assinatura

Usuários autenticados podem cadastrar uma assinatura através do endpoint:

```text
POST /subscriptions
```

A rota utiliza autenticação baseada em `accessToken`, validação de entrada
através do Celebrate/Joi e validações de domínio implementadas no `Mongoose`.

Fluxo simplificado:

```text
POST /subscriptions
↓
Celebrate valida presença e formato do accessToken
↓
accessMiddleware executa
↓
jwt.verify() executa
↓
req.user recebe o payload autenticado
↓
validateContentType valida o Content-Type
↓
Celebrate/Joi valida os dados enviados
↓
Controller verifica se o usuário já possui assinatura
↓
MongoDB cria a assinatura
↓
Documento do usuário é atualizado com:
  - subscription: true
  - subscriptionDetails
↓
populate('subscriptionDetails')
↓
Documento atualizado é retornado
```

A funcionalidade utiliza uma `whitelist` explícita para evitar a persistência de
campos não previstos pela aplicação.

Além das validações de entrada realizadas pelo Celebrate/Joi, a entidade
Subscription implementa regras de consistência de domínio através do `Mongoose`.

Exemplo:

```text
Os dias selecionados e os horários informados devem corresponder exatamente.
```

Essa validação é executada através do middleware de documento:

```js
schema.pre('validate');
```

garantindo a consistência dos dados antes da persistência no banco de dados.

A criação de assinatura também impede que um mesmo usuário possua múltiplas
assinaturas, retornando:

```text
409 Conflict
```

quando uma assinatura já existe para o proprietário autenticado.

### ✔️ Cardápio

#### Consulta de produtos

A aplicação disponibiliza um endpoint público responsável por recuperar os
produtos disponíveis no cardápio:

```text
GET /menu
```

A implementação atual realiza a consulta diretamente na coleção de produtos
utilizando o `Mongoose`, retornando os documentos persistidos no MongoDB para
consumo do frontend.

Fluxo simplificado:

```text
GET /menu
↓
Controller recebe requisição
↓
MongoDB localiza apenas produtos:
  - com estoque disponível
  - dentro do prazo de validade
↓
Documentos são convertidos com lean()
↓
Resposta HTTP 200
↓
Frontend atualiza o cardápio
```

A regra de disponibilidade é aplicada no backend através da consulta ao banco de
dados, evitando que produtos indisponíveis ou vencidos sejam enviados ao
frontend.

Por se tratar de uma rota exclusivamente de leitura, não existem validações de
`Content-Type` ou Celebrate/Joi na implementação atual.

A funcionalidade é utilizada em conjunto com o mecanismo de atualização
periódica (`polling`) implementado no frontend para manter o cardápio
sincronizado com o estado atual do banco de dados.

### ✔️ Fale Conosco

#### Cadastro de mensagens

A aplicação disponibiliza um endpoint público para envio de mensagens de
contato:

```text
POST /messages
```

A funcionalidade permite que visitantes autenticados ou não autenticados enviem
mensagens para a plataforma.

A rota utiliza validação de entrada através do Celebrate/Joi e validações de
persistência implementadas no `Mongoose`.

Fluxo simplificado:

```text
POST /messages
↓
validateContentType valida o Content-Type
↓
Celebrate/Joi valida os dados da requisição
↓
Controller localiza usuário através do e-mail informado
↓
Usuário encontrado?
  ├─ Sim → owner recebe o _id do usuário
  └─ Não → owner recebe null
↓
MongoDB cria a mensagem
↓
Notificação por e-mail é enviada ao administrador, via API Externa (Resend)
↓
Resposta HTTP 201 Created
```

A implementação utiliza uma `whitelist` explícita durante a criação do
documento, persistindo apenas os campos previstos pela aplicação.

Quando o e-mail informado pertence a um usuário já cadastrado, a mensagem é
automaticamente associada ao proprietário através do campo `owner`.

Mensagens enviadas por usuários ainda não cadastrados permanecem registradas
normalmente, porém sem vínculo de proprietário (`owner: null`).

### ✔️ Mercados Parceiros

#### Inscrição de parceria

A aplicação disponibiliza um endpoint público para cadastro de mercados
interessados em estabelecer parceria com a plataforma:

```text
POST /partners
```

A rota utiliza validação de entrada através do Celebrate/Joi e validações de
persistência implementadas no `Mongoose`.

Fluxo simplificado:

```text
POST /partners
↓
validateContentType valida o Content-Type
↓
Celebrate/Joi valida os dados da requisição
↓
Controller verifica existência prévia do CNPJ
↓
CNPJ já cadastrado?
  ├─ Sim → 409 Conflict
  └─ Não
↓
MongoDB cria o parceiro
↓
Notificação administrativa é enviada via Resend
↓
HTTP 201 Created
```

A implementação utiliza uma `whitelist` explícita durante a criação do
documento, persistindo apenas os campos previstos pela aplicação.

Falhas no envio da notificação administrativa não impedem a persistência dos
dados do parceiro, garantindo disponibilidade do fluxo mesmo diante de
indisponibilidade temporária do serviço de e-mail.

### ✔️ Geração de Número do Pedido

A aplicação gera automaticamente o número dos pedidos no backend, tanto para
pedidos avulsos, quanto para pedidos de assinatura.

O identificador é composto pela data atual e por uma sequência numérica
aleatória. Para pedidos de assinatura, é adicionado um 'S' no início na
numeração.

Exemplos:

```text
Pedido avulso:
202611061234

Pedido de assinatura:
S202611061234
```

A geração ocorre antes da persistência do pedido através do utilitário
`generateOrderNumber`.

Essa abordagem centraliza a geração do identificador no servidor e impede que o
frontend defina ou manipule números de pedido.

### ✔️ Precificação no Servidor

O valor total dos pedidos não é recebido do frontend.

Embora a interface calcule e exiba o valor durante o preenchimento do pedido, o
backend recalcula o valor utilizando as regras de negócio definidas no módulo de
pedidos.

Essa abordagem evita manipulação de preços através de requisições alteradas,
garantindo que o valor persistido seja sempre consistente com as regras da
aplicação.

As regras de precificação estão centralizadas no módulo `orders.pricing.js`,
permitindo que alterações de preços sejam realizadas em um único local da
aplicação.

### ✔️ Pedidos

#### Cadastro de pedido avulso

A aplicação disponibiliza um endpoint público para criação de pedidos avulsos:

```text
POST /orders
```

A rota utiliza validação de entrada através do Celebrate/Joi e validações de
persistência implementadas no `Mongoose`.

Fluxo:

```text
POST /orders
↓
validateContentType valida o Content-Type
↓
Celebrate/Joi valida os dados da requisição
↓
Controller localiza usuário através do e-mail informado
↓
Usuário encontrado?
  ├─ Sim → owner recebe o _id do usuário
  └─ Não → owner recebe null
↓
Backend gera o número do pedido
↓
Backend calcula o valor total do pedido
↓
MongoDB cria o pedido
↓
HTTP 201 Created
```

A funcionalidade permite que pedidos sejam realizados por usuários cadastrados
ou visitantes.

Quando o e-mail informado pertence a um usuário previamente cadastrado, o pedido
é automaticamente associado ao proprietário.

Pedidos realizados por visitantes permanecem registrados normalmente com
`owner: null`.

Os dados enviados pelo cliente são persistidos como snapshots
(`customerSnapshot`, `addressSnapshot` e `itemsSnapshot`), preservando o estado
do pedido no momento da compra, independentemente de alterações futuras nos
cadastros relacionados.

#### Consulta de pedido avulso

A aplicação disponibiliza um endpoint público para consulta de pedidos avulsos:

```text
GET /orders/:orderNumber?email=user@email.com
```

A consulta exige simultaneamente:

- número do pedido (orderNumber);
- e-mail utilizado durante o cadastro do pedido.

Fluxo:

```text
GET /orders/:orderNumber
↓
Celebrate/Joi valida:
  - presença do e-mail
  - formato do orderNumber
  - formato do e-mail
  - ausência de parâmetros não permitidos
↓
MongoDB localiza o pedido através de:
  - orderNumber
  - customerSnapshot.email
↓
Pedido encontrado?
  ├─ Sim → HTTP 200 OK
  └─ Não → 404 Not Found
```

A utilização combinada do número do pedido com o e-mail informado durante a
compra reduz a exposição de pedidos de terceiros e impede consultas baseadas
apenas na numeração do pedido.

[Voltar ao topo 🔝](#top)

---

<a id="-11-estrutura-do-projeto"></a>

## 🗃️ 11. Estrutura do projeto

```text
├── .husky/
│     └── pre-commit
├── .vscode/
│     ├── extensions.json
│     └── settings.json
├── docs/
│     └── images/
├── scripts/
│     └── clearLogs.js
├── src/
│     ├── config/
│     │     ├── cors.js
│     │     ├── database.js
│     │     ├── env.js
│     │     └── validateEnv.js
│     ├── modules/
│     │     ├── admin/
│     │     │     ├── admin.index.js
│     │     │     └── admin.routes.js
│     │     ├── auth/
│     │     │     ├── auth.controller.js
│     │     │     ├── auth.index.js
│     │     │     ├── auth.middleware.js
│     │     │     ├── auth.routes.js
│     │     │     └── auth.validation.js
│     │     ├── contact/
│     │     │     ├── contact.controller.js
│     │     │     ├── contact.index.js
│     │     │     ├── contact.routes.js
│     │     │     ├── contact.service.js
│     │     │     ├── contact.validation.js
│     │     │     └── message.model.js
│     │     ├── menu/
│     │     │     ├── menu.controller.js
│     │     │     ├── menu.index.js
│     │     │     ├── menu.routes.js
│     │     │     └── product.model.js
│     │     ├── orders/
│     │     │     ├── order.model.js
│     │     │     ├── orders.controller.js
│     │     │     ├── orders.index.js
│     │     │     ├── orders.pricing.js
│     │     │     ├── orders.routes.js
│     │     │     └── orders.validation.js
│     │     ├── partners/
│     │     │     ├── partner.model.js
│     │     │     ├── partners.controller.js
│     │     │     ├── partners.index.js
│     │     │     ├── partners.routes.js
│     │     │     ├── partners.service.js
│     │     │     └── partners.validation.js
│     │     ├── recipes/
│     │     │     └── today-recipe.model.js
│     │     ├── subscriptions/
│     │     │     ├── subscription-order.model.js
│     │     │     ├── subscription.model.js
│     │     │     ├── subscriptions.controller.js
│     │     │     ├── subscriptions.index.js
│     │     │     ├── subscriptions.routes.js
│     │     │     └── subscriptions.validation.js
│     │     └── users/
│     │           ├── user.model.js
│     │           ├── users.controller.js
│     │           ├── users.index.js
│     │           ├── users.routes.js
│     │           └── users.validation.js
│     ├── routes/
│     │     └── index.js
│     ├── seeds/
│     │     └── products.seed.js
│     ├── shared/
│     │     ├── errors/
│     │     │     ├── ConfigError.js
│     │     │     ├── ConflictError.js
│     │     │     ├── ForbiddenError.js
│     │     │     ├── NotFoundError.js
│     │     │     ├── RateLimitError.js
│     │     │     ├── UnauthorizedError.js
│     │     │     └── UnsupportedMediaTypeError.js
│     │     ├── logger/
│     │     │     └── logger.js
│     │     ├── middlewares/
│     │     │     ├── errorHandler.js
│     │     │     ├── errorLogger.js
│     │     │     ├── isOwnerOrAdminMiddleware.js
│     │     │     ├── limiter.js
│     │     │     ├── notFoundPage.js
│     │     │     ├── requestLogger.js
│     │     │     ├── roleMiddleware.js
│     │     │     └── validateContentType.js
│     │     ├── services/
│     │     │     └── email.service.js
│     │     └── utils/
│     │           ├── constants.js
│     │           ├── errorsMessages.js
│     │           └── generateOrderNumber.js
│     └── app.js
├── tests/
│     ├── config/
│     │     └── validateEnv.test.js
│     ├── helpers/
│     │     └── testApp.js
│     ├── middlewares/
│     │     ├── errorHandler.test.js
│     │     ├── limiter.test.js
│     │     ├── notFoundPage.test.js
│     │     └── roleMiddleware.test.js
│     ├── models/
│     │     ├── message.model.test.js
│     │     ├── order.model.test.js
│     │     ├── partner.model.test.js
│     │     ├── product.model.test.js
│     │     ├── subscription-order.model.test.js
│     │     ├── subscription.model.test.js
│     │     ├── today-recipe.model.test.js
│     │     └── user.model.test.js
│     ├── modules/
│     │     ├── auth/
│     │     │     ├── access.middleware.test.js
│     │     │     ├── login.test.js
│     │     │     ├── logout.test.js
│     │     │     ├── refreshAccess.test.js
│     │     │     ├── refreshUser.test.js
│     │     │     └── register.test.js
│     │     ├── contact/
│     │     │     ├── contact.service.test.js
│     │     │     └── registerUserMsg.test.js
│     │     ├── menu/
│     │     │     └── getMenu.test.js
│     │     ├── orders/
│     │     │     ├── createOrder.test.js
│     │     │     ├── getOrderByNumber.test.js
│     │     │     └── orders.pricing.test.js
│     │     ├── partners/
│     │     │     ├── partners.service.test.js
│     │     │     └── registerPartner.test.js
│     │     ├── subscriptions/
│     │     │     └── createSubscription.test.js
│     │     └── users/
│     │           ├── getUserMsgs.test.js
│     │           ├── getUserOrders.test.js
│     │           ├── updateSubscriptionProfile.test.js
│     │           └── updateUserProfile.test.js
│     ├── routes/
│     │     └── testRoutes.js
│     ├── setup/
│     │     └── jest.setup.js
│     └── utils/
│           └── generateOrderNumber.test.js
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

- `config`: carregamento de ambiente, validações de configuração, conexão com
  banco de dados e configurações de infraestrutura
- `modules`: módulos organizados por domínio de negócio
- `scripts`: scripts administrativos e utilitários executados manualmente
  através do npm
- `seeds`: scripts utilitários para carga inicial e população controlada de
  dados no banco de dados
- `shared`: recursos compartilhados entre módulos
  - `errors`: classes de erros customizados da aplicação
  - `logger`: configuração centralizada de logs da aplicação
  - `middlewares`: middlewares reutilizáveis, incluindo tratamento centralizado
    de erros
  - `services`: serviços compartilhados entre módulos, incluindo integrações
    externas
  - `utils`: funções utilitárias compartilhadas
- `tests`: testes unitários, testes de integração, aplicação auxiliar de teste
  (`testApp`) e rotas específicas para cenários de validação

### Estrutura dos módulos

Cada módulo concentra seus próprios arquivos:

- `.controller.js`: controladores das rotas, recebe a requisição do frontend e,
  quando necessário, chama o service
- `.index.js`: ponto de entrada do módulo utilizado pelo agregador central de
  rotas
- `.middleware.js`: middlewares específicos do módulo, quando necessário
- `.model.js`: modelos do MongoDB para persistência de dados
- `.pricing.js`: regras de precificação e cálculos relacionados ao domínio,
  quando aplicável
- `.routes.js`: definição das rotas
- `.service.js`: lógica de negócio e integrações externas quando necessário
- `.validation.js`: validação dos dados recebidos do frontend

[Voltar ao topo 🔝](#top)

---

<a id="-12-roadmap"></a>

## 🗺️ 12. Roadmap

Infraestrutura Base → Segurança → Observabilidade → Qualidade Base → Modelagem
de Dados → Autenticação → Funcionalidades Core → Qualidade → Documentação →
Deploy

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

### ✅ Fase 5: Modelagem de Dados

#### Schemas (`Mongoose`)

- [x] Model/User
- [x] Model/Subscription
- [x] Model/Product
- [x] Model/Order
- [x] Model/SubscriptionOrder
- [x] Model/Message
- [x] Model/Partner
- [x] Model/TodayRecipe

#### Testes Unitários - Models (Jest)

- [x] User Model
- [x] Subscription Model
- [x] Product Model
- [x] Order Model
- [x] SubscriptionOrder Model
- [x] Message Model
- [x] Partner Model
- [x] TodayRecipe Model

### ✅ Fase 6: Autenticação

#### Validação de Entrada - Requisições HTTP - Rotas (Celebrate/Joi)

- [x] `auth.validation.js`

#### Infraestrutura HTTP

- [x] Configuração cookie-parser
- [x] Validação Content-Type

#### Autenticação

- [x] Cadastro de usuário
- [x] Hash de senha (bcrypt)
- [x] Login
- [x] Geração de JWT
- [x] Middleware de autenticação (`accessMiddleware`)
- [x] Middleware de recuperação/renovação de sessão (`refreshMiddleware`)
- [x] Recuperação de sessão (`refreshUser`)
- [x] Renovação de sessão (`refreshAccess`)
- [x] Logout

#### Testes de Integração (Supertest)

- [x] Cadastro de usuário
- [x] Login
- [x] Middleware de autenticação
- [x] Recuperação de sessão (`refreshUser`)
- [x] Renovação de sessão (`refreshAccess`)
- [x] Logout

### ✅ Fase 7: Autorização

- [x] Campo `role` em User Model
- [x] Integração entre JWT e roles
- [x] Middleware de autorização (`roleMiddleware`)
- [x] Rota dev/test de `admin`
- [x] Middleware de proprietário (`isOwnerOrAdminMiddleware`)

#### Testes de Integração (Supertest)

- [x] Middleware de autorização (`roleMiddleware`)
- [x] Middleware de proprietário (`isOwnerOrAdminMiddleware`)

### 🚧 Fase 8: Funcionalidades Core

#### Validações de Entrada - Requisições HTTP - Rotas (Celebrate/Joi)

- [ ] `users.validation.js`
- [ ] `subscriptions.validation.js`
- [x] `orders.validation.js`
- [x] `contact.validation.js`
- [x] `partners.validation.js`
- [ ] `recipes.validation.js`

#### Usuários

- [x] Atualizar perfil cadastral
- [x] Atualizar perfil de assinatura
  - [x] Ativar assinatura
  - [x] Pausar assinatura
- [x] Histórico de pedidos avulsos
- [ ] Histórico de pedidos de assinatura
- [x] Histórico de mensagens

#### Assinaturas

- [x] Criar assinatura
- [ ] Criar pedido de assinatura
- [ ] Localizar pedido de assinatura

#### Cardápio

- [x] Seed de produtos
- [x] Busca de menu
- [x] Controle de disponibilidade

#### Pedidos avulsos

- [x] Criar pedido avulso
- [x] Localizar pedido avulso

#### Fale Conosco

- [x] Cadastro de mensagens
- [x] Notificação administrativa por e-mail (API Externa: Resend)

#### Mercados Parceiros

- [x] Inscrição de parceria
- [x] Notificação administrativa por e-mail (API Externa: Resend)

#### Receitas

- [ ] API Externa de receitas
- [ ] Busca de receitas de hoje
  - [ ] Persistência das receitas
- [ ] Pesquisa de receitas

#### Admin

- [ ] Cadastro de admin
- [ ] Adicionar produto no cardápio
- [ ] Remover produto do cardápio
- [ ] Responder mensagens + API Externa para envio de e-mail/WhatsApp

#### Testes de Integração (Supertest)

- [ ] Usuários
- [ ] Assinaturas
- [x] Cardápio
- [x] Pedidos avulsos
- [x] Fale Conosco
- [x] Mercados Parceiros
- [ ] Receitas
- [ ] Admin

### 🚧 Fase 9: Integrações Externas Extras

- [ ] API de clima
- [ ] API de CEP
- [ ] API de mapa

#### Testes de Integração (Supertest)

- [ ] API de clima
- [ ] API de CEP
- [ ] API de mapa

### 🚧 Fase 10: Qualidade

#### Testes Unitários (Jest)

- [ ] Services
- [ ] Validators
- [ ] Utilitários

### 🚧 Fase 11: Documentação

- [ ] README final
- [ ] README técnico
- [ ] Coleção Postman

### 🚀 Fase 12: Deploy

#### Infraestrutura

- [ ] Migração MongoDB Local → MongoDB Atlas
- [ ] Ambiente de produção
- [ ] Variáveis de ambiente de produção

#### Deploy

- [ ] Render

### 📚 Melhorias Futuras

- [ ] Revogação de sessão baseada em `refreshToken`

- [ ] Utilização de chaves distintas para `accessToken` e `refreshToken`:
  - `JWT_ACCESS_SECRET`
  - `JWT_REFRESH_SECRET`

- [ ] Organização de endpoints por domínio:

  Atualmente alguns recursos relacionados ao perfil do usuário são expostos
  através de rotas agrupadas em `/users/*`, acompanhando a organização da
  feature `Profile` no frontend.

  Avaliar futura refatoração para uma arquitetura orientada ao domínio:

  - `PATCH /users/subscriptions/me` → `PATCH /subscriptions/me`
  - `GET /users/:userId/orders` → `GET /orders/me`
  - `GET /users/:userId/subscriptions/orders` → `GET /subscriptions/orders/me`
  - `GET /users/:userId/messages` → `GET /messages/me`

  A alteração exigirá refatoração coordenada entre frontend e backend, com
  migração dos services para suas respectivas features (`Subscriptions`,
  `Orders` e `Contact`), aumentando a coesão e facilitando a manutenção da API
  em cenários de crescimento do projeto.

- [ ] Notificação automática para produtos próximos ao vencimento

- [ ] Implementar API Externa para envio de e-mail/WhatsApp em:
  - Cadastro de usuário
  - Cadastro de assinatura
  - Criar pedido de assinatura
  - Criar pedido avulso

- Criar uma rotina automática no backend para mudar `status` de assinatura para
  `false `quando a data `endAt` vencer

- [ ] Documentação com Swagger/OpenAPI

---

[Voltar ao topo 🔝](#top)
