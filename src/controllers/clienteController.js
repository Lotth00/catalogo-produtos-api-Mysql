const Cliente = require('../models/clienteModel');

const validateUser = (req) => {
    if (!req.user || !req.user.id) {
        const error = new Error('Usuário não autenticado ou ID não informado');
        error.status = 401;
        throw error;
    }
};

const listarClientes = async (req, res) => {
    try {
        validateUser(req);
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const buscarCliente = async (req, res) => {
    try {
        validateUser(req);
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' });
        res.json(cliente);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const criarCliente = async (req, res) => {
    try {
        validateUser(req);
        const { nome, email, senha, telefone, status } = req.body;
        if (!nome || !email || !senha) {
            return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
        }
        const novoCliente = await Cliente.create(nome, email, senha, telefone, status);
        res.status(201).json(novoCliente);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }
        res.status(error.status || 500).json({ message: error.message });
    }
};

const atualizarCliente = async (req, res) => {
    try {
        validateUser(req);
        const { nome, email, senha, telefone, status } = req.body;
        if (!nome || !email) {
            return res.status(400).json({ message: 'Nome e email são obrigatórios' });
        }
        const clienteExistente = await Cliente.findById(req.params.id);
        if (!clienteExistente) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        const clienteAtualizado = await Cliente.update(
            req.params.id, nome, email, senha, telefone, status
        );
        res.json(clienteAtualizado);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const deletarCliente = async (req, res) => {
    try {
        validateUser(req);
        const clienteExistente = await Cliente.findById(req.params.id);
        if (!clienteExistente) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        await Cliente.remove(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

module.exports = {
    listarClientes,
    buscarCliente,
    criarCliente,
    atualizarCliente,
    deletarCliente
};