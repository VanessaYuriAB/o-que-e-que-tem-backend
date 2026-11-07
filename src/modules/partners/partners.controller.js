import Partner from './partner.model.js';
import sendNewPartnerNotificationToAdmin from './partners.service.js';
import ConflictError from '../../shared/errors/ConflictError.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';

// registerPartner > '/partners'
const registerPartner = async (req, res) => {
  const existingPartner = await Partner.findOne({ cnpj: req.body.cnpj });

  if (existingPartner) {
    throw new ConflictError(`${errorsMessages.conflict} CNPJ duplicado.`);
  }

  // Whilelist: princípio de defesa em profundidade
  const partnerData = await Partner.create({
    userName: req.body.userName,
    email: req.body.email,
    tel: req.body.tel,

    contactMethod: req.body.contactMethod,

    companyName: req.body.companyName,
    cnpj: req.body.cnpj,
    cep: req.body.cep,

    address: req.body.address,
    numberAddress: req.body.numberAddress,
    complementAddress: req.body.complementAddress,
    district: req.body.district,
  });

  await sendNewPartnerNotificationToAdmin(partnerData);

  res.status(201).send(partnerData);
};

export default registerPartner;
