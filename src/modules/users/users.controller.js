import User from './user.model.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';
//import logger from '../../shared/logger/logger.js';

// updateUserProfile > '/users/me'
const updateUserProfile = async (req, res) => {
  const userId = req.user._id;

  // Whilelist : defesa em profundidade
  const updateData = {};

  [
    'userName',
    'email',
    'tel',
    'address',
    'number',
    'complement',
    'district',
    'cep',
    'infoText',
  ].forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    returnDocument: 'after', // substitui o 'new: true,' atualmente
    runValidators: true,
  }).orFail(() => {
    throw new NotFoundError(
      `${errorsMessages.notFound} Erro ao atualizar perfil cadastral: não existe usuário com o id solicitado (Recurso não encontrado).`,
    );
  });

  res.send(updatedUser);
};

// updateSubscriptionProfile > '/users/subscriptions/me'

// getOrdersByUserId > '/users/:userId/orders'

// getSubscriptionOrdersByUserId > '/users/:userId/subscriptions/orders'

// getMessagesByUserId > '/users/:userId/messages'

export { updateUserProfile };
