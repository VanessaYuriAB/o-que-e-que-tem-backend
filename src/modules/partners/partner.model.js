import mongoose from 'mongoose';
import validator from 'validator';

const partnerSchema = new mongoose.Schema(
  /* Campos */
  {
    userName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 40,
      match: /^[^<>]+$/, // bloqueia HTML básico por segurança ('<' e '>')
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: (props) => `${props.value} não é um email válido!`,
      },
      trim: true,
    },
    tel: {
      type: String,
      required: true,
      minlength: 14,
      maxlength: 15,
      match: /^\([1-9]{2}\)\s[0-9]?[0-9]{4}-[0-9]{4}$/,
      trim: true,
    },

    contactMethod: {
      type: String,
      enum: ['email', 'tel'],
    },

    companyName: {
      type: String,
      required: true,
      match: /^[^<>]+$/, // bloqueia HTML básico por segurança ('<' e '>')
      trim: true,
    },
    cnpj: {
      type: String,
      required: true,
      minlength: 14,
      maxlength: 18,
      match:
        /^([A-Z0-9]{12}[0-9]{2}|[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-[0-9]{2})$/,
      trim: true,
    },
    cep: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 9,
      match: /^[0-9]{5}-?[0-9]{3}$/,
    },

    address: {
      type: String,
      match: /^[^<>]+$/, // bloqueia HTML básico por segurança ('<' e '>')
      trim: true,
    },
    numberAddress: {
      type: String,
      match: /^[a-zA-Z0-9\s]*$/,
      trim: true,
    },
    complementAddress: {
      type: String,
      match: /^[a-zA-Z0-9\s.-]*$/,
      trim: true,
    },
    district: {
      type: String,
      match: /^[a-zA-ZÀ-ÿ0-9\s]*$/,
      trim: true,
    },
  },
  /* Opções */
  {
    timestamps: true,
    // Cria 'createdAt' e 'updatedAt' automaticamente
  },
);

export default mongoose.model('Partner', partnerSchema);
