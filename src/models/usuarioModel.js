const usuarioModel = require('../models/usuarioModel');
const jwt = require('jsonwebtoken');

// Gerar Token JWT (permanece igual)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Registrar usuário
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verifica se o e-mail já está cadastrado
        const userExists = await usuarioModel.findUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        // Cria o novo usuário no MySQL
        const newUser = await usuarioModel.createUser(name, email, password);

        res.status(201).json({
            _id: newUser.id,
            name: newUser.nome,
            email: newUser.email,
            token: generateToken(newUser.id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Busca o usuário pelo e-mail
        const user = await usuarioModel.findUserByEmail(email);

        // Verifica se o usuário existe e a senha está correta
        if (user && (await usuarioModel.comparePassword(password, user.senha))) {
            res.json({
                _id: user.id,
                name: user.nome,
                email: user.email,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'E-mail ou senha inválidos' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };