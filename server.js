const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { protect } = require('./src/middlewares/authMiddleware');

dotenv.config();
connectDB();

const app = express();

// Middleware para ler JSON
app.use(express.json());

// Rotas PÚBLICAS (não precisam de token)
app.use('/api/auth', authRoutes);

// Rotas PRIVADAS (precisam de token - por isso o 'protect' é passado)
// O 'protect' vai rodar ANTES de chegar no productRoutes
app.use('/api/products', protect, productRoutes);

app.get('/', (req, res) => {
  res.send('API do Catálogo de Produtos está rodando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});