import mongoose from 'mongoose';

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
      enum: ['two', 'four', 'six', 'twelve'],
      required: true,
    },

    daysOn: {
      type: [
        {
          type: String,
          enum: ['seg', 'ter', 'qua', 'qui', 'sex'],
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
      enum: ['delivery', 'drive-thru'],
      required: true,
    },

    pay: {
      type: String,
      enum: ['pix', 'debito', 'credito'],
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
