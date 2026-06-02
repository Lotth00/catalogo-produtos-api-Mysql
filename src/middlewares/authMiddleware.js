const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Pega o token do header: "Bearer TOKEN_AQUI"
      token = req.headers.authorization?.split(' ')[1];

      // Verifica se o token é válido
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca o usuário no banco e joga na requisição (req.user) para usar depois
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Permite seguir para a próxima função (o controller)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Não autorizado, token falhou' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, sem token' });
  }
};

module.exports = { protect };