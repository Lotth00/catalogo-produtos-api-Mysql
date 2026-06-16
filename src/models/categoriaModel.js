const pool = require('../config/database');

const findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM categorias ORDER BY id_categoria');
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
    return rows[0];
};

const create = async (nome) => {
    const [result] = await pool.query('INSERT INTO categorias (nome) VALUES (?)', [nome]);
    return { id_categoria: result.insertId, nome };
};

const update = async (id, nome) => {
    await pool.query('UPDATE categorias SET nome = ? WHERE id_categoria = ?', [nome, id]);
    return { id_categoria: id, nome };
};

const remove = async (id) => {
    await pool.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
};

module.exports = { findAll, findById, create, update, remove };