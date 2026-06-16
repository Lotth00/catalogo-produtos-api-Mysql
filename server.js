const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes'); // se existir
const categoriaRoutes = require('./src/routes/categoriaRoutes'); // <-- NOVO
const { protect } = require('./src/middlewares/authMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();

// Rota da documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware para ler JSON
app.use(express.json());

// ---------- ROTAS PÚBLICAS (não precisam de token) ----------
app.use('/api/auth', authRoutes);

// Rota pública de versão (já existe)
app.get('/api/status', (req, res) => {
    res.json({ versao: '2.0.0', status: 'online' });
});

// ---------- ROTAS PRIVADAS (precisam de token) ----------
app.use('/api/products', protect, productRoutes); // se ainda for usar

// Rota de categorias (já tem o middleware protect dentro de cada endpoint)
app.use('/api/categorias', categoriaRoutes); // <-- NOVO

app.get('/', (req, res) => {
  res.send('API do Catálogo de Produtos está rodando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});