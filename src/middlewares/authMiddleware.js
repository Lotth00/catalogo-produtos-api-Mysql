const jwt = require('jsonwebtoken');
const pool = require('../config/database'); 

const protect = async (req, res, next) => {
  let token;

  // Verifica se o header Authorization contém um token Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Extrai o token
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifica e decodifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Busca o usuário no MySQL (tabela clientes)
      const [rows] = await pool.query(
        'SELECT id_cliente AS id, nome, email FROM clientes WHERE id_cliente = ?',
        [decoded.id] // decoded.id vem do payload do token (geralmente o id do usuário)
      );

      // 4. Se não encontrar o usuário, retorna erro
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      // 5. Coloca os dados do usuário na requisição (req.user)
      req.user = rows[0]; // Agora é um objeto com { id, nome, email }

      next(); // Prossegue para o próximo middleware/controller
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Não autorizado, token falhou' });
    }
  }

  // Se não houver token, retorna erro
  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, sem token' });
  }
};

module.exports = { protect };