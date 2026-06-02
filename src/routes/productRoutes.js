const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retorna lista de todos os produtos
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos obtida com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.route('/').get(getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: integer
 *           example:
 *             name: "Camiseta Polo"
 *             price: 49.90
 *             description: "Camiseta de algodão 100%"
 *             category: "Vestuário"
 *             quantity: 100
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.route('/').post(createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.route('/:id').get(getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do produto
 *               descricao:
 *                 type: string
 *                 description: Descrição detalhada do produto
 *               preco:
 *                 type: number
 *                 description: Preço do produto
 *               categoria:
 *                 type: string
 *                 description: Categoria do produto
 *               quantidade:
 *                 type: integer
 *                 description: Quantidade em estoque
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.route('/:id').put(updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.route('/:id').delete(deleteProduct);

module.exports = router;