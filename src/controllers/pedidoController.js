const Pedido = require('../models/pedidoModel');

const validateUser = (req) => {
    if (!req.user || !req.user.id) {
        const error = new Error('Usuário não autenticado ou ID não informado');
        error.status = 401;
        throw error;
    }
};

const listarPedidos = async (req, res) => {
    try {
        validateUser(req);
        const pedidos = await Pedido.findAll();
        res.json(pedidos);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const buscarPedido = async (req, res) => {
    try {
        validateUser(req);
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });
        res.json(pedido);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const criarPedido = async (req, res) => {
    try {
        validateUser(req);
        const { clientes_id_cliente, itens } = req.body;
        
        // Validação: o cliente_id deve ser o mesmo do usuário logado
        if (clientes_id_cliente !== req.user.id) {
            return res.status(403).json({ 
                message: 'Você só pode criar pedidos para o seu próprio ID' 
            });
        }
        
        if (!clientes_id_cliente || !itens || itens.length === 0) {
            return res.status(400).json({ 
                message: 'Cliente e itens são obrigatórios' 
            });
        }
        
        const novoPedido = await Pedido.create(clientes_id_cliente, itens);
        res.status(201).json(novoPedido);
        
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const atualizarPedido = async (req, res) => {
    try {
        validateUser(req);
        const { data, itens } = req.body;
        
        const pedidoExistente = await Pedido.findById(req.params.id);
        if (!pedidoExistente) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        
        // Verifica se o pedido pertence ao usuário
        if (pedidoExistente.clientes_id_cliente !== req.user.id) {
            return res.status(403).json({ 
                message: 'Você só pode alterar os seus próprios pedidos' 
            });
        }
        
        const pedidoAtualizado = await Pedido.update(req.params.id, data, itens);
        res.json(pedidoAtualizado);
        
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const deletarPedido = async (req, res) => {
    try {
        validateUser(req);
        const pedidoExistente = await Pedido.findById(req.params.id);
        if (!pedidoExistente) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        
        if (pedidoExistente.clientes_id_cliente !== req.user.id) {
            return res.status(403).json({ 
                message: 'Você só pode deletar os seus próprios pedidos' 
            });
        }
        
        await Pedido.remove(req.params.id);
        res.status(204).send();
        
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

module.exports = {
    listarPedidos,
    buscarPedido,
    criarPedido,
    atualizarPedido,
    deletarPedido
};