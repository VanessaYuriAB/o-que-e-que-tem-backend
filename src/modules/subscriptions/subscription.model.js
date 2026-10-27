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

    begin: {
      type: Date, // formato no frontend '2026-07-21'
    },
    end: {
      type: Date, // formato no frontend '2027-07-21'
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
// Middlware de documento do Mongoose para pré-validação
subscriptionSchema.pre('validate', function () {
  const allSchedulesFilled = this.daysOn.every((day) =>
    this.schedules?.get(day),
  );

  if (!allSchedulesFilled) {
    this.invalidate(
      'schedules',
      'Todos os dias selecionados precisam possuir horário.',
    );
  }
});

export default mongoose.model('Subscription', subscriptionSchema);
