const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor, adicione um nome'],
    },
    email: {
      type: String,
      required: [true, 'Por favor, adicione um e-mail'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor, adicione um e-mail válido',
      ],
    },
    password: {
      type: String,
      required: [true, 'Por favor, adicione uma senha'],
      minlength: 6,
      select: false, // Não retorna a senha quando alguém buscar o usuário
    },
  },
  {
    timestamps: true,
  }
);

// Criptografar a senha antes de salvar (pré-hook)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar a senha no login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);