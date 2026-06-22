const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    listarClientes,
    buscarCliente,
    criarCliente,
    atualizarCliente,
    deletarCliente
} = require('../controllers/clienteController');

router.route('/')
    .get(protect, listarClientes)
    .post(protect, criarCliente);

router.route('/:id')
    .get(protect, buscarCliente)
    .put(protect, atualizarCliente)
    .delete(protect, deletarCliente);

module.exports = router;