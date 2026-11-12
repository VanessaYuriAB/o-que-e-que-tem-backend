import mongoose from 'mongoose';
import { PRODUCTS_CATEGORIES } from '../../shared/utils/constants.js';

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
      enum: PRODUCTS_CATEGORIES,
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
      type: Date,
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
