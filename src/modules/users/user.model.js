import mongoose from 'mongoose';
import validator from 'validator';
import UnauthorizedError from '../../shared/errors/UnauthorizedError.js';
import errorsMessages from '../../shared/utils/errorsMessages.js';
import bcrypt from 'bcryptjs';

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
      select: false, // não retorna hash de senha por padrão em consultas (queries: find, findOne, findById) - mas métodos como create, save, new Model() não passam por projeção e o campo é retornado em requisições realizadas
      // O esquema armazena hashes bcrypt, não a senha original do usuário - a validação dos dados do frontend é realizada pelo Celebrate/Joi
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

// Método estático do mongoose (model) > autenticação por credenciais, com msg de erro genérica, sem revelar sobre a existência do e-mail, para evitar enumeração de usuários > loginUser
userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password,
) {
  const userInDb = await this.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new UnauthorizedError(
        `${errorsMessages.unauthorized} Login não autenticado.`,
      );
    });

  const passwordMatch = await bcrypt.compare(password, userInDb.password);

  if (!passwordMatch) {
    throw new UnauthorizedError(
      `${errorsMessages.unauthorized} Login não autenticado.`,
    );
  }

  return userInDb;
};

export default mongoose.model('User', userSchema);
