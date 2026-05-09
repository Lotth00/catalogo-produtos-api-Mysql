const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // A variável process.env.MONGO_URI vem do arquivo .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar: ${error.message}`);
    process.exit(1); // Encerra o processo se não conectar
  }
};

module.exports = connectDB;