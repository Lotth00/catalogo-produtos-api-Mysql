const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');   // NOVO
const pedidoRoutes = require('./src/routes/pedidoRoutes');     // NOVO
const { protect } = require('./src/middlewares/authMiddleware');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
    res.json({ versao: '2.0.0', status: 'online' });
});

app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);      
app.use('/api/categorias', categoriaRoutes);   
app.use('/api/clientes', clienteRoutes);       
app.use('/api/pedidos', pedidoRoutes);        

app.get('/', (req, res) => {
    res.send('API do Catálogo de Produtos está rodando!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});