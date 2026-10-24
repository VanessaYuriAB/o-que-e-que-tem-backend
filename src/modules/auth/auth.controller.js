import User from '../users/user.model.js';
import ConflictError from '../../shared/errors/ConflictError.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';

// register > '/auth/register'
// Cria usuário (com verificação de e-mail duplicado e senha em hash)
const registerUser = async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    throw new ConflictError(`${errorsMessages.conflict} E-mail duplicado.`);
  }

  const hash = await bcrypt.hash(req.body.password, 10);

  // Princípio de defesa em profundidade, controller ignora qualquer 'role' recebido
  // Mesmo que o Joi tenha 'role' permitido, por acidente, o controller continua seguro
  const user = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    tel: req.body.tel,
    password: hash,
  });

  return res.status(201).send({
    userName: user.userName,
    email: user.email,
    tel: user.tel,
  });
};

// login > '/auth/login'
// Gera JWTs, incluindo 'role', e autentica usuário
const loginUser = async (req, res) => {
  const userInDb = await User.findUserByCredentials(
    req.body.email,
    req.body.password,
  ); // validação de credenciais via método estático do mongoose definido em User Schema/Model

  // Acesso às rotas protegidas
  const accessToken = jwt.sign(
    { _id: userInDb._id, role: userInDb.role },
    env.JWT_SECRET,
    {
      expiresIn: '15m',
    },
  );

  // Renovação da sessão
  const refreshToken = jwt.sign(
    { _id: userInDb._id, role: userInDb.role },
    env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  });

  res.send({ success: true });
};

// refresh (user) > '/auth/me'
// Recupera sessão existente e retorna usuário logado, sem 'password' que é bloqueado pelo schema
const refreshUser = async (req, res) => {
  const loggedUser = await User.findById(req.user._id).orFail(() => {
    throw new NotFoundError(
      `${errorsMessages.notFound} Cadastro de usuário inexistente.`,
    );
  });

  res.send({ loggedUser });
};

// refresh (token) > '/auth/access'
// Renova sessão existente: gera e envia novo cookie accessToken
const refreshAccess = (req, res) => {
  const accessToken = jwt.sign(
    { _id: req.user._id, role: req.user.role },
    env.JWT_SECRET,
    {
      expiresIn: '15m',
    },
  );

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.send({ success: true });
};

// logout > '/auth/logout'
const logoutUser = (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  res.send({ message: 'Logout realizado' });
};

export { registerUser, loginUser, refreshUser, refreshAccess, logoutUser };
