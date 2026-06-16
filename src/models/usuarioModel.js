const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const findUserByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT id_cliente AS id, nome, email, senha FROM clientes WHERE email = ?',
        [email]
    );
    return rows[0];
};

const createUser = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
        'INSERT INTO clientes (nome, email, senha) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
    );
    return { id: result.insertId, nome: name, email };
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = { findUserByEmail, createUser, comparePassword };