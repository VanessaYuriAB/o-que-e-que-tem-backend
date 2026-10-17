import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
      minlength: 8,
      match: /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      select: false, // não retorna hash de senha por padrão nas consultas (queries: find, findOne, findById) - mas métodos como create, save, new Model() não passam por projeção e o campo é retornado na requisição realizada
      trim: true,
    },

    cep: {
      type: String,
      minlength: 9,
      maxlength: 9,
      match: /^[0-9]{5}-[0-9]{3}$/,
    },
    address: {
      type: String,
      match: /^[^<>]+$/, // bloqueia HTML básico por segurança ('<' e '>')
      trim: true,
    },
    number: {
      type: String,
      match: /^[a-zA-Z0-9\s]*$/,
      trim: true,
    },
    complement: {
      type: String,
      match: /^[a-zA-Z0-9\s.-]*$/,
      trim: true,
    },
    district: {
      type: String,
      match: /^[a-zA-ZÀ-ÿ0-9\s]*$/,
      trim: true,
    },
    infoText: {
      type: String,
      match: /^[^<>]+$/, // bloqueia HTML básico por segurança ('<' e '>')
      trim: true,
    },

    subscription: {
      type: Boolean,
      default: false,
    },
    subscriptionDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription', // nome do model registrado no Mongoose
    },
  },
  /* Opções */
  {
    timestamps: true,
    // Cria 'createdAt' e 'updatedAt' automaticamente
  },
);

export default mongoose.model('User', userSchema);
