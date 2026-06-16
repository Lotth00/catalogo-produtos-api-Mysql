const categoriaModel = require('../models/categoriaModel');

// Validação: usuário autenticado E ID do usuário presente
const validateUser = (req) => {
    if (!req.user || !req.user.id) {
        const error = new Error('Usuário não autenticado ou ID não informado');
        error.status = 401;
        throw error;
    }
    // Opcional: verificar se o ID do usuário no token bate com algum ID enviado no body/headers
    // Exemplo: const userIdFromBody = req.body.userId;
    // if (userIdFromBody && userIdFromBody !== req.user.id) { error 403 }
};

const listarCategorias = async (req, res) => {
    try {
        validateUser(req);
        const categorias = await categoriaModel.findAll();
        res.json(categorias);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const buscarCategoria = async (req, res) => {
    try {
        validateUser(req);
        const categoria = await categoriaModel.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }
        res.json(categoria);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const criarCategoria = async (req, res) => {
    try {
        validateUser(req);
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ message: 'Nome da categoria é obrigatório' });
        }
        const novaCategoria = await categoriaModel.create(nome);
        res.status(201).json(novaCategoria);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const atualizarCategoria = async (req, res) => {
    try {
        validateUser(req);
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ message: 'Nome da categoria é obrigatório' });
        }
        const categoriaExistente = await categoriaModel.findById(req.params.id);
        if (!categoriaExistente) {
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }
        const categoriaAtualizada = await categoriaModel.update(req.params.id, nome);
        res.json(categoriaAtualizada);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const deletarCategoria = async (req, res) => {
    try {
        validateUser(req);
        const categoriaExistente = await categoriaModel.findById(req.params.id);
        if (!categoriaExistente) {
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }
        await categoriaModel.remove(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

module.exports = {
    listarCategorias,
    buscarCategoria,
    criarCategoria,
    atualizarCategoria,
    deletarCategoria
};