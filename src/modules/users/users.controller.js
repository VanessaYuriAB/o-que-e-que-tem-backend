import User from './user.model.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';
import Subscription from '../subscriptions/subscription.model.js';
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
const updateSubscriptionProfile = async (req, res) => {
  // Whilelist : defesa em profundidade
  // Define ação conforme req.body (pausa/retomada de assinatura ou edição de configuração)
  const updateData =
    req.body.status !== undefined
      ? { status: req.body.status }
      : {
          daysOn: req.body.daysOn,
          schedules: req.body.schedules,
          method: req.body.method,
        };

  const subscription = await Subscription.findOne({
    owner: req.user._id,
  }).orFail(() => {
    throw new NotFoundError(
      `${errorsMessages.notFound} Erro ao atualizar perfil de assinatura: não existe assinatura para o id solicitado (Recurso não encontrado).`,
    );
  });

  Object.assign(subscription, updateData);

  await subscription.save();

  const updatedSubscriptionUser = await User.findById(req.user._id)
    .populate('subscriptionDetails')
    .orFail(() => {
      throw new NotFoundError(
        `${errorsMessages.notFound} Erro ao atualizar perfil de assinatura: não existe usuário para o id solicitado (Recurso não encontrado).`,
      );
    });

  // Retorna o objeto user completo, contento subscriptionDetails
  res.send(updatedSubscriptionUser);
};

// getOrdersByUserId > '/users/:userId/orders'

// getSubscriptionOrdersByUserId > '/users/:userId/subscriptions/orders'

// getMessagesByUserId > '/users/:userId/messages'

export { updateUserProfile, updateSubscriptionProfile };
