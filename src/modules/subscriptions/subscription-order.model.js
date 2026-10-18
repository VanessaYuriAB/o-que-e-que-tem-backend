import mongoose from 'mongoose';
import validator from 'validator';

const subscriptionOrderSchema = new mongoose.Schema(
  /* Campos */
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // nome do model registrado no Mongoose
      required: true,
    },

    orderNumber: {
      type: String,
      required: true,
      match: /^S\d{12}$/,
      unique: true,
      index: true,
      trim: true,
    },

    meal: {
      type: String,
      required: true,
      enum: ['sopa', 'creme', 'pate'],
    },
    method: {
      type: String,
      required: true,
      enum: ['delivery', 'drive-thru'],
    },

    day: {
      type: Date, // formato no frontend '01/09/2026'
      required: true,
    },

    time: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/, // formato no frontend '10:50'
      validate: {
        validator(value) {
          const [hour, minute] = value.split(':').map(Number);

          const current = hour * 60 + minute;
          const min = 10 * 60 + 45; // 10:45
          const max = 19 * 60 + 45; // 19:45

          return current >= min && current <= max;
        },
        message: 'O horário deve estar entre 10:45 e 19:45.',
      },
    },

    customerSnapshot: {
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
      tel: {
        type: String,
        required: true,
        minlength: 14,
        maxlength: 15,
        match: /^\([1-9]{2}\)\s[0-9]?[0-9]{4}-[0-9]{4}$/,
        trim: true,
      },
    },

    addressSnapshot: {
      address: {
        type: String,
        match: /^[^<>]+$/, // bloqueia HTML básico por segurança ('<' e '>')
        trim: true,
        required() {
          return this.method === 'delivery';
        },
      },
      number: {
        type: String,
        match: /^[a-zA-Z0-9\s]*$/,
        trim: true,
        required() {
          return this.method === 'delivery';
        },
      },
      complement: {
        type: String,
        match: /^[a-zA-Z0-9\s.-]*$/,
        trim: true,
        required() {
          return this.method === 'delivery';
        },
      },
      district: {
        type: String,
        match: /^[a-zA-ZÀ-ÿ0-9\s]*$/,
        trim: true,
        required() {
          return this.method === 'delivery';
        },
      },
      cep: {
        type: String,
        minlength: 9,
        maxlength: 9,
        match: /^[0-9]{5}-[0-9]{3}$/,
        required() {
          return this.method === 'delivery';
        },
      },
    },

    itemsSnapshot: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },

          productName: {
            type: String,
            required: true,
            trim: true,
          },

          category: {
            type: String,
            required: true,
            enum: [
              'carboidratos',
              'verduras-legumes',
              'leites-derivados',
              'carnes-ovos-peixes',
              'leguminosas-oleaginosas',
              'oleos-gorduras',
              'acucares-doces',
            ],
          },

          partnerName: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      validate: {
        validator: (v) => v.length > 0,
        message: 'O pedido deve conter pelo menos um item.',
      },
    },

    obs: {
      type: String,
      match: /^[^<>]+$/, // bloqueia HTML básico por segurança ('<' e '>')
      trim: true,
    },
  },
  /* Opções */
  {
    timestamps: true,
    // Cria 'createdAt' e 'updatedAt' automaticamente
  },
);

export default mongoose.model('SubscriptionOrder', subscriptionOrderSchema);
