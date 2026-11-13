import Subscription from './subscription.model.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';
import ConflictError from '../../shared/errors/ConflictError.js';
import User from '../users/user.model.js';
import NotFoundError from '../../shared/errors/NotFoundError.js';
import SubscriptionOrder from './subscription-order.model.js';
import generateOrderNumber from '../../shared/utils/generateOrderNumber.js';
//import logger from '../../shared/logger/logger.js';

// createSubscription > '/subscriptions'
const createSubscription = async (req, res) => {
  // Quando chegar aqui, se o usuário não possuía cadastro, ele foi realizado antes do envio da criação da assinatura, pelo hook da feature no frontend - portanto haverá JWT com _id
  // Também já foi realizada a atualização de dados cadastrais, portanto os dados retornados na requisição, estarão atualizados - são retornados os dados de usuário completos, conforme contrato do frontend, para atualização do estado global de 'user'
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

// createSubscriptionOrder > '/subscriptions/orders'
const createSubscriptionOrder = async (req, res) => {
  // Whilelist : defesa em profundidade
  const subscriptionOrderData = await SubscriptionOrder.create({
    owner: req.user._id,
    orderNumber: generateOrderNumber('subscriptionOrderType'),

    meal: req.body.meal,
    method: req.body.method,

    day: req.body.day,
    time: req.body.time,

    customerSnapshot: {
      userName: req.body.customerSnapshot.userName,
      email: req.body.customerSnapshot.email,
      tel: req.body.customerSnapshot.tel,
    },

    addressSnapshot:
      req.body.method === 'delivery'
        ? {
            address: req.body.addressSnapshot.address,
            number: req.body.addressSnapshot.number,
            complement: req.body.addressSnapshot.complement,
            district: req.body.addressSnapshot.district,
            cep: req.body.addressSnapshot.cep,
          }
        : undefined,

    itemsSnapshot: req.body.itemsSnapshot.map((item) => ({
      _id: item._id,
      productName: item.productName,
      category: item.category,
      partnerName: item.partnerName,
    })),

    obs: req.body.obs,
  });

  res.status(201).send(subscriptionOrderData);
};

// getSubscriptionOrderByNumber > `/subscriptions/orders/:subscriptionOrderNumber` > Query:
// ?email=user@email.com

export { createSubscription, createSubscriptionOrder };
