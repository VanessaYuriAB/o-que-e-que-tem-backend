import Subscription from './subscription.model.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';
import ConflictError from '../../shared/errors/ConflictError.js';
import User from '../users/user.model.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';
//import logger from '../../shared/logger/logger.js';

// createSubscription > '/subscriptions'
const createSubscription = async (req, res) => {
  // Quando chegar aqui, se o usuário não possuía cadastro, ele foi realizado antes do envio da criação da assinatura, pelo hook da feature no frontend - portanto haverá JWT com _id
  const userId = req.user._id;

  const existingUserSubscription = await Subscription.findOne({
    owner: userId,
  });

  if (existingUserSubscription) {
    throw new ConflictError(
      `${errorsMessages.conflict} Proprietário de assinatura duplicado.`,
    );
  }

  // Whilelist : defesa em profundidade
  const subscription = await Subscription.create({
    owner: userId,
    howLong: req.body.howLong,
    daysOn: req.body.daysOn,
    schedules: req.body.schedules,
    method: req.body.method,
    pay: req.body.pay,
  });

  const updatedUserWithSubscription = await User.findByIdAndUpdate(
    userId,
    { subscription: true, subscriptionDetails: subscription._id },
    {
      returnDocument: 'after', // substitui o 'new: true,' atualmente
      runValidators: true,
    },
  )
    .populate('subscriptionDetails')
    .orFail(() => {
      throw new NotFoundError(
        `${errorsMessages.notFound} Erro ao criar assinatura: não existe usuário com o id solicitado (Recurso não encontrado).`,
      );
    });

  return res.status(201).send(updatedUserWithSubscription);
};

// getSubscriptionOrderByNumber > `/subscriptions/orders/:subscriptionOrderNumber` > Query:
// ?email=user@email.com

// sendSubscriptionOrderToServer > '/subscriptions/orders'

export { createSubscription };
