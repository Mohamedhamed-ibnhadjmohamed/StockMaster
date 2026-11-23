const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du produit est obligatoire'],
      trim: true,
    },
    reference: {
      type: String,
      required: [true, 'La référence du produit est obligatoire'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Le prix du produit est obligatoire'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'La quantité ne peut pas être négative'],
    },
    minThreshold: {
      type: Number,
      default: 0,
      min: [0, 'Le seuil minimum ne peut pas être négatif'],
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);