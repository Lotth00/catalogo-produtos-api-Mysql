const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes'); 
const pedidoRoutes = require('./src/routes/pedidoRoutes');   
const { protect } = require('./src/middlewares/authMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/status', (req, res) => {
    res.json({ versao: '2.0.0', status: 'online' });
});

app.use('/api/products', protect, productRoutes);
app.use('/api/categorias', categoriaRoutes); 
app.use('/api/clientes', clienteRoutes);    
app.use('/api/pedidos', pedidoRoutes);    

app.get('/', (req, res) => {
    res.send('API do Catálogo de Produtos está rodando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});