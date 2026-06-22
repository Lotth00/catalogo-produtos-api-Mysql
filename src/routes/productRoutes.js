const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // <-- ADICIONE ESTA LINHA
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

router.route('/')
    .get(protect, getProducts)
    .post(protect, createProduct);

router.route('/:id')
    .get(protect, getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;