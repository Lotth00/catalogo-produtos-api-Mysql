const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    listarPedidos,
    buscarPedido,
    criarPedido,
    atualizarPedido,
    deletarPedido
} = require('../controllers/pedidoController');

router.route('/')
    .get(protect, listarPedidos)
    .post(protect, criarPedido);

router.route('/:id')
    .get(protect, buscarPedido)
    .put(protect, atualizarPedido)
    .delete(protect, deletarPedido);

module.exports = router;