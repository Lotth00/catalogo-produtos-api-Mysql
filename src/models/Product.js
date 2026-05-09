const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor, adicione um nome'], // Validação obrigatória
      trim: true,
      unique: true, // Não deixa cadastrar dois produtos com o mesmo nome
    },
    price: {
      type: Number,
      required: [true, 'Por favor, adicione um preço'],
    },
    description: {
      type: String,
      required: [true, 'Por favor, adicione uma descrição'],
    },
    category: {
      type: String,
      required: [true, 'Por favor, adicione uma categoria'],
      enum: ['eletrônicos', 'roupas', 'livros', 'alimentos'], // Só aceita essas opções
    },
    inStock: {
      type: Boolean,
      default: true, // Se não for passado nada, padrão é 'true'
    },
  },
  {
    timestamps: true, // Cria automaticamente os campos 'createdAt' e 'updatedAt'
  }
);

module.exports = mongoose.model('Product', productSchema);