# API de Catálogo de Produtos

API RESTful para gerenciamento de produtos com autenticação de usuários.

## Índice

- Como rodar o projeto
- Endpoints da API
- Tecnologias utilizadas

## Como rodar o projeto

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- MongoDB instalado localmente OU conta no MongoDB Atlas

### Passo a passo

1. Clone o repositório:
```
git clone https://github.com/Lotth00/catalogo-produtos-api.git
```

2. Entre na pasta do projeto:
```
cd catalogo-produtos-api
```

3. Instale as dependências:
```
npm install
```

4. Configure as variáveis de ambiente:
   - Copie o arquivo .env.example e renomeie para .env
   - Preencha com seus dados:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/catalogo_db
JWT_SECRET=umsegredobemseguro123
```

5. Inicie o servidor:
```
node server.js
```

O servidor vai rodar em http://localhost:3000

## Endpoints da API

### Autenticação (rotas públicas)

**POST /api/auth/register** - Criar nova conta
Exemplo de corpo: {"name": "João", "email": "joao@email.com", "password": "123456"}

**POST /api/auth/login** - Fazer login
Exemplo de corpo: {"email": "joao@email.com", "password": "123456"}

### Produtos (rotas protegidas - precisam de token)

**Como usar o token:** Adicione no cabeçalho (header) da requisição:
Authorization: Bearer SEU_TOKEN_AQUI

**GET /api/products** - Listar todos os produtos

**GET /api/products/:id** - Buscar produto por ID

**POST /api/products** - Cadastrar novo produto
Exemplo de corpo: {"name": "Fone Bluetooth", "price": 99.90, "description": "Fone com cancelamento de ruído", "category": "eletrônicos"}

**PUT /api/products/:id** - Atualizar produto
Exemplo de corpo: {"price": 79.90, "inStock": false}

**DELETE /api/products/:id** - Deletar produto

### Exemplo prático

1. Registrar usuário:
```
POST http://localhost:3000/api/auth/register
Corpo: {"name": "Meu Usuario", "email": "meuemail@teste.com", "password": "123456"}
```

2. Fazer login (copiar o token da resposta):
```
POST http://localhost:3000/api/auth/login
Corpo: {"email": "meuemail@teste.com", "password": "123456"}
```

Resposta que você recebe:
```
{
  "_id": "...",
  "name": "Meu Usuario",
  "email": "meuemail@teste.com",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

3. Listar produtos (usando o token):
```
GET http://localhost:3000/api/products
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

4. Criar um produto:
```
POST http://localhost:3000/api/products
Header: Authorization: Bearer SEU_TOKEN
Corpo: {"name": "Produto Teste", "price": 99.90, "description": "Um produto qualquer", "category": "eletrônicos"}
```

## Tecnologias utilizadas

- Node.js - Ambiente de execução
- Express - Framework web
- MongoDB - Banco de dados NoSQL
- Mongoose - Modelagem de dados
- JWT - Autenticação via token
- Bcryptjs - Criptografia de senhas
- dotenv - Gerenciamento de variáveis de ambiente

## Autor

Desenvolvido como atividade acadêmica.

GitHub: Lotth00