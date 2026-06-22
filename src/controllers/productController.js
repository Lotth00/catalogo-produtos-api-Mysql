const Product = require('../models/Product');

// Validação de usuário autenticado
const validateUser = (req) => {
    if (!req.user || !req.user.id) {
        const error = new Error('Usuário não autenticado ou ID não informado');
        error.status = 401;
        throw error;
    }
};

const getProducts = async (req, res) => {
    try {
        validateUser(req);
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        validateUser(req);
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
        res.status(200).json(product);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        validateUser(req);
        const { nome, valor, estoque, categorias_id_categoria } = req.body;
        
        if (!nome || valor === undefined || estoque === undefined || !categorias_id_categoria) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }
        
        const newProduct = await Product.create({ nome, valor, estoque, categorias_id_categoria });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        validateUser(req);
        const { nome, valor, estoque, categorias_id_categoria } = req.body;
        
        if (!nome || valor === undefined || estoque === undefined || !categorias_id_categoria) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }
        
        const productExists = await Product.findById(req.params.id);
        if (!productExists) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        
        const updatedProduct = await Product.update(req.params.id, { nome, valor, estoque, categorias_id_categoria });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        validateUser(req);
        const productExists = await Product.findById(req.params.id);
        if (!productExists) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        
        await Product.remove(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};