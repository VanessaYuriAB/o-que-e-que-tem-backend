import User from '../users/user.model.js';
import ConflictError from '../../shared/errors/ConflictError.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';
import bcrypt from 'bcryptjs';

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

// logout > '/auth/logout'

// refresh > '/auth/me'

export { registerUser };
