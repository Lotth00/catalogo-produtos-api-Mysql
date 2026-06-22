const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const findAll = async () => {
    const [rows] = await pool.query(
        'SELECT id_cliente, nome, email, telefone, status FROM clientes ORDER BY id_cliente'
    );
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query(
        'SELECT id_cliente, nome, email, telefone, status FROM clientes WHERE id_cliente = ?',
        [id]
    );
    return rows[0];
};

const create = async (nome, email, senha, telefone, status = 'medio') => {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const [result] = await pool.query(
        `INSERT INTO clientes (nome, email, senha, telefone, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [nome, email, hashedPassword, telefone, status]
    );
    return { id_cliente: result.insertId, nome, email, telefone, status };
};

const update = async (id, nome, email, senha, telefone, status) => {
    let query = 'UPDATE clientes SET nome = ?, email = ?, telefone = ?, status = ?';
    const params = [nome, email, telefone, status];
    
    if (senha) {
        const hashedPassword = await bcrypt.hash(senha, 10);
        query += ', senha = ?';
        params.push(hashedPassword);
    }
    
    query += ' WHERE id_cliente = ?';
    params.push(id);
    
    await pool.query(query, params);
    return findById(id);
};

const remove = async (id) => {
    await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
};

module.exports = { findAll, findById, create, update, remove };