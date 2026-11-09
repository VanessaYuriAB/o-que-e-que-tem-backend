import Order from './order.model.js';
import User from '../users/user.model.js';
import generateOrderNumber from '../../shared/utils/generateOrderNumber.js';
import calculateOrderAmount from './orders.pricing.js';

// createOrder > '/orders'
const createOrder = async (req, res) => {
  // A requisição pode ser feita com usuário cadastrado/logado ou não
  const userInDb = await User.findOne({
    email: req.body.customerSnapshot.email,
  })
    .select('_id')
    .lean();

  // O valor total é calculado no servidor, com os dados enviados pelo frontend + utilitários
  const amount = calculateOrderAmount(req.body.meal, req.body.method);

  // Whilelist : defesa em profundidade
  const orderData = await Order.create({
    owner: userInDb?._id ?? null,
    orderNumber: generateOrderNumber('orderType'),

    meal: req.body.meal,
    method: req.body.method,
    payment: req.body.payment,
    amount,

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

  res.status(201).send(orderData);
};

// getOrderByNumber > `/orders/:orderNumber` > Query: ?email=user@email.com

export { createOrder };
