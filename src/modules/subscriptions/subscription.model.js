import mongoose from 'mongoose';
import {
  SUBSCRIPTION_DAYS,
  DELIVERY_METHODS,
  SUBSCRIPTION_DURATIONS,
  PAYMENT_METHODS,
} from '../../shared/utils/constants.js';

const subscriptionSchema = new mongoose.Schema(
  /* Campos */
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // nome do model registrado no Mongoose
      required: true,
    },

    status: {
      type: Boolean,
      default: true,
    },

    howLong: {
      type: String,
      enum: SUBSCRIPTION_DURATIONS,
      required: true,
    },

    daysOn: {
      type: [
        {
          type: String,
          enum: SUBSCRIPTION_DAYS,
        },
      ],
      required: true,
    },
    schedules: {
      type: Map,
      of: String,
      default: {},
      // Validação com pre('validate') do Mongoose, abaixo do schema
      required: true,
    },

    method: {
      type: String,
      enum: DELIVERY_METHODS,
      required: true,
    },

    pay: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },
  },
  /* Opções */
  {
    timestamps: true,
    // Cria 'createdAt' e 'updatedAt' automaticamente
  },
);

// Validação de consistência entre propriedades do documento inteiro (daysOn e schedules)
// Middleware de documento do Mongoose para pré-validação
subscriptionSchema.pre('validate', function () {
  const daysOn = [...this.daysOn].sort();

  const schedulesDays = [...this.schedules.keys()].sort();

  const sameDays = JSON.stringify(daysOn) === JSON.stringify(schedulesDays);

  if (!sameDays) {
    this.invalidate(
      'schedules',
      'Os dias selecionados e os horários informados devem corresponder exatamente.',
    );
  }
});

export default mongoose.model('Subscription', subscriptionSchema);
