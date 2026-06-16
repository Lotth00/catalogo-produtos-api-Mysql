const pool = require('../config/database');

/**
 * Busca todos os produtos com o nome da categoria
 */
const findAll = async () => {
    const [rows] = await pool.query(`
        SELECT 
            p.id_produto AS id,
            p.nome,
            p.valor AS price,
            p.estoque,
            c.nome AS category
        FROM produtos p
        LEFT JOIN categorias c ON p.categorias_id_categoria = c.id_categoria
        ORDER BY p.id_produto
    `);
    return rows;
};

/**
 * Busca um produto pelo ID
 */
const findById = async (id) => {
    const [rows] = await pool.query(`
        SELECT 
            p.id_produto AS id,
            p.nome,
            p.valor AS price,
            p.estoque,
            c.nome AS category
        FROM produtos p
        LEFT JOIN categorias c ON p.categorias_id_categoria = c.id_categoria
        WHERE p.id_produto = ?
    `, [id]);
    return rows[0];
};

/**
 * Cria um novo produto
 * @param {Object} productData - { nome, valor, estoque, categorias_id_categoria }
 */
const create = async (productData) => {
    const { nome, valor, estoque, categorias_id_categoria } = productData;
    const [result] = await pool.query(
        `INSERT INTO produtos (nome, valor, estoque, categorias_id_categoria) 
         VALUES (?, ?, ?, ?)`,
        [nome, valor, estoque, categorias_id_categoria]
    );
    return { id: result.insertId, ...productData };
};

/**
 * Atualiza um produto existente
 */
const update = async (id, productData) => {
    const { nome, valor, estoque, categorias_id_categoria } = productData;
    await pool.query(
        `UPDATE produtos 
         SET nome = ?, valor = ?, estoque = ?, categorias_id_categoria = ? 
         WHERE id_produto = ?`,
        [nome, valor, estoque, categorias_id_categoria, id]
    );
    return { id, ...productData };
};

/**
 * Remove um produto
 */
const remove = async (id) => {
    await pool.query('DELETE FROM produtos WHERE id_produto = ?', [id]);
};

module.exports = { findAll, findById, create, update, remove };