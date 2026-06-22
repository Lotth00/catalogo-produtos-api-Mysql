const pool = require('../config/database');

const findAll = async () => {
    const [rows] = await pool.query(`
        SELECT p.*, c.nome AS categoria_nome 
        FROM produtos p
        JOIN categorias c ON p.categorias_id_categoria = c.id_categoria
        ORDER BY p.id_produto
    `);
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query(`
        SELECT p.*, c.nome AS categoria_nome 
        FROM produtos p
        JOIN categorias c ON p.categorias_id_categoria = c.id_categoria
        WHERE p.id_produto = ?
    `, [id]);
    return rows[0];
};

const create = async (nome, valor, estoque, categorias_id_categoria) => {
    const [result] = await pool.query(
        'INSERT INTO produtos (nome, valor, estoque, categorias_id_categoria) VALUES (?, ?, ?, ?)',
        [nome, valor, estoque, categorias_id_categoria]
    );
    return findById(result.insertId);
};

const update = async (id, nome, valor, estoque, categorias_id_categoria) => {
    await pool.query(
        'UPDATE produtos SET nome = ?, valor = ?, estoque = ?, categorias_id_categoria = ? WHERE id_produto = ?',
        [nome, valor, estoque, categorias_id_categoria, id]
    );
    return findById(id);
};

const remove = async (id) => {
    await pool.query('DELETE FROM produtos WHERE id_produto = ?', [id]);
};

module.exports = { findAll, findById, create, update, remove };