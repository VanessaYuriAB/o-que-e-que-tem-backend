import Message from './message.model.js';
import User from '../users/user.model.js';
import sendUserMsgNotificationToAdmin from './contact.service.js';

// registerUserMsg > '/messages'
const registerUserMsg = async (req, res) => {
  // A requisição pode ser enviada, pelo frontend, com usuário logado ou não

  // Se usuário estiver logado ou se usuário não estiver logado e for cadastrado: busca _id pelo email e atualiza 'owner'
  // Se usuário não estiver logado e não for cadastrado: 'owner' null

  const userInDb = await User.findOne({
    email: req.body.email,
  }).select('_id');

  // Whilelist: princípio de defesa em profundidade
  const msgData = await Message.create({
    owner: userInDb?._id ?? null,
    userName: req.body.userName,
    email: req.body.email,
    whatsapp: req.body.whatsapp,
    message: req.body.message,
    method: req.body.method,
  });

  await sendUserMsgNotificationToAdmin(msgData);

  res.status(201).send(msgData);
};

export default registerUserMsg;
