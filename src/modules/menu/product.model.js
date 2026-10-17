import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  /* Campos */
  {
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

    qtyAvailable: {
      type: Number,
      required: true,
      min: 0,
    },

    partnerName: {
      type: String,
      required: true,
      trim: true,
    },

    availableUntil: {
      type: Date, // formato no frontend 'new Date().toISOString()'
      required: true,
    },
  },
  /* Opções */
  {
    timestamps: true,
    // Cria 'createdAt' e 'updatedAt' automaticamente
  },
);

export default mongoose.model('Product', productSchema);
