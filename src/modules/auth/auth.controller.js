import User from '../users/user.model.js';
import ConflictError from '../../shared/errors/ConflictError.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../../config/env.js';

// register > '/auth/register'
// Cria usuário (com verificação de e-mail duplicado e senha em hash)
const registerUser = async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    throw new ConflictError(`${errorsMessages.conflict} E-mail duplicado.`);
  }

  const hash = await bcrypt.hash(req.body.password, 10);

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
// Gera JWT e autentica usuário
const loginUser = async (req, res) => {
  const userInDb = await User.findUserByCredentials(
    req.body.email,
    req.body.password,
  ); // validação de credenciais via método estático do mongoose definido em User Schema/Model

  // Acesso às rotas protegidas
  const accessToken = jwt.sign({ _id: userInDb._id }, env.JWT_SECRET, {
    expiresIn: '15m',
  });

  // Renovação da sessão
  const refreshToken = jwt.sign({ _id: userInDb._id }, env.JWT_SECRET, {
    expiresIn: '7d',
  });

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

// logout > '/auth/logout'

// refresh > '/auth/me'

export { registerUser, loginUser };
