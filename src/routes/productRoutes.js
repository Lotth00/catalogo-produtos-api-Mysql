const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Rota para /api/products
router.route('/').get(getProducts).post(createProduct);

// Rota para /api/products/:id
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

module.exports = router;