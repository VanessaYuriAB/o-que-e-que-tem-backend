const errorsMessages = {
  noNodeEnv: 'NODE_ENV não definido. Utilize os scripts do package.json.',
  nodeEnv: 'NODE_ENV inválido, verifique a definição no script utilizado.',
  config:
    'é uma variável obrigatória, é preciso defini-la no arquivo .env utilizado.',
};

export default errorsMessages;
