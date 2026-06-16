const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    listarCategorias,
    buscarCategoria,
    criarCategoria,
    atualizarCategoria,
    deletarCategoria
} = require('../controllers/categoriaController');

router.route('/')
    .get(protect, listarCategorias)
    .post(protect, criarCategoria);

router.route('/:id')
    .get(protect, buscarCategoria)
    .put(protect, atualizarCategoria)
    .delete(protect, deletarCategoria);

module.exports = router;