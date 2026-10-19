import mongoose from 'mongoose';
import validator from 'validator';

const messageSchema = new mongoose.Schema(
  /* Campos */
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // nome do model registrado no Mongoose
      default: null,
    },

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
      validate: {
        validator: (v) => validator.isEmail(v),
        message: (props) => `${props.value} não é um email válido!`,
      },
      trim: true,
    },
    whatsapp: {
      type: String,
      required: true,
      minlength: 14,
      maxlength: 15,
      match: /^\([1-9]{2}\)\s[0-9]?[0-9]{4}-[0-9]{4}$/,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      match: /^[^<>]+$/, // bloqueia HTML básico por segurança ('<' e '>')
      trim: true,
    },

    method: {
      type: String,
      required: true,
      enum: ['email', 'whatsapp'],
    },

    status: {
      type: Boolean,
      default: false,
    },

    responseAt: {
      type: Date, // formato no frontend '08/09/2026, 19:40:05'
      default: null,
    },

    response: {
      type: String,
      match: /^[^<>]+$/, // bloqueia HTML básico por segurança ('<' e '>')
      trim: true,
      default: null,
    },
  },
  /* Opções */
  {
    timestamps: true,
    // Cria 'createdAt' e 'updatedAt' automaticamente
  },
);

export default mongoose.model('Message', messageSchema);
