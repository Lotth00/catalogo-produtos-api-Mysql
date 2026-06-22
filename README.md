# API de Catálogo de Produtos

API RESTful para gerenciamento de produtos com autenticação de usuários e persistência em **MySQL**.

## Índice

- Como rodar o projeto
- Endpoints da API
- Tecnologias utilizadas


## Como rodar o projeto

### Pré-requisitos

- Node.js instalado (versão 14 ou superior)
- MySQL instalado localmente (ou servidor MySQL acessível)
- MySQL Workbench (opcional, para gerenciar o banco)

---

### Passo a passo

1. **Clone o repositório:**
```
git clone https://github.com/Lotth00/catalogo-produtos-api-Mysql.git
```

2. **Entre na pasta do projeto:**
```
cd catalogo-produtos-api-Mysql
```

3. **Instale as dependências:**
```
npm install
```

4. **Configure as variáveis de ambiente:**
   - Copie o arquivo `.env.example` e renomeie para `.env`
   - Preencha com os dados do seu MySQL:

```
PORT=3000
JWT_SECRET=umsegredobemseguro123

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=loja
```

5. **Crie o banco de dados e as tabelas no MySQL:**

   Execute os seguintes comandos no **MySQL Workbench** ou no terminal:

```sql
CREATE DATABASE IF NOT EXISTS loja;
USE loja;

-- Tabela de clientes (para autenticação)
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(15),
    status ENUM('bom','medio','ruim') DEFAULT 'medio',
    PRIMARY KEY (id_cliente)
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    PRIMARY KEY (id_categoria)
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id_produto INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    valor DOUBLE NOT NULL,
    estoque INT NOT NULL DEFAULT 1,
    categorias_id_categoria INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_produto),
    FOREIGN KEY (categorias_id_categoria) REFERENCES categorias (id_categoria)
);
```

6. **Insira um usuário de teste (opcional, mas recomendado):**

```sql
INSERT INTO clientes (nome, email, senha) 
VALUES ('Admin Teste', 'admin@teste.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
```
> A senha para este usuário é `123456` (já criptografada com bcrypt).

7. **Inicie o servidor:**
```
npm start
```
ou, se preferir com auto-reload:
```
npm run dev
```

O servidor vai rodar em **http://localhost:3000**

---

## Endpoints da API

### 🔓 Autenticação (rotas públicas)

| Método | Rota | Descrição |
|--------|------|-----------|
| **POST** | `/api/auth/register` | Criar nova conta |
| **POST** | `/api/auth/login` | Fazer login e obter token |

**Exemplo de corpo para registro:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

**Exemplo de corpo para login:**
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

**Resposta do login (contém o token JWT):**
```json
{
  "_id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 📊 Status da API (rota pública)

| Método | Rota | Descrição |
|--------|------|-----------|
| **GET** | `/api/status` | Verifica se a API está online e qual a versão |

**Exemplo de resposta:**
```json
{
  "versao": "2.0.0",
  "status": "online"
}
```

---

### 🔒 Produtos (rotas protegidas)

> **Como usar o token:** Adicione no cabeçalho (header) da requisição:
> ```
> Authorization: Bearer SEU_TOKEN_AQUI
> ```

| Método | Rota | Descrição |
|--------|------|-----------|
| **GET** | `/api/products` | Listar todos os produtos |
| **GET** | `/api/products/:id` | Buscar produto por ID |
| **POST** | `/api/products` | Cadastrar novo produto |
| **PUT** | `/api/products/:id` | Atualizar produto |
| **DELETE** | `/api/products/:id` | Deletar produto |

**Exemplo de corpo para criar/atualizar produto:**
```json
{
  "name": "Fone Bluetooth",
  "valor": 99.90,
  "estoque": 10,
  "categorias_id_categoria": 1
}
```

---

### 📂 Categorias (rotas protegidas)

| Método | Rota | Descrição |
|--------|------|-----------|
| **GET** | `/api/categorias` | Listar todas as categorias |
| **GET** | `/api/categorias/:id` | Buscar categoria por ID |
| **POST** | `/api/categorias` | Criar nova categoria |
| **PUT** | `/api/categorias/:id` | Atualizar categoria |
| **DELETE** | `/api/categorias/:id` | Deletar categoria |

**Exemplo de corpo para criar categoria:**
```json
{
  "nome": "Eletrônicos"
}
```

---

### Exemplo prático de uso

#### 1. Registrar um usuário
```
POST http://localhost:3000/api/auth/register
Corpo: {"name": "Meu Usuario", "email": "meuemail@teste.com", "password": "123456"}
```

#### 2. Fazer login (copiar o token da resposta)
```
POST http://localhost:3000/api/auth/login
Corpo: {"email": "meuemail@teste.com", "password": "123456"}
```

#### 3. Listar produtos (enviando o token)
```
GET http://localhost:3000/api/products
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### 4. Criar um produto
```
POST http://localhost:3000/api/products
Header: Authorization: Bearer SEU_TOKEN
Corpo: {"name": "Produto Teste", "valor": 99.90, "estoque": 5, "categorias_id_categoria": 1}
```

#### 5. Criar uma categoria
```
POST http://localhost:3000/api/categorias
Header: Authorization: Bearer SEU_TOKEN
Corpo: {"nome": "Informática"}
```

---

## Tecnologias utilizadas

- **Node.js** – Ambiente de execução JavaScript
- **Express** – Framework web para Node.js
- **MySQL** – Sistema de banco de dados relacional
- **mysql2** – Driver MySQL com suporte a Promises/async-await
- **JWT (jsonwebtoken)** – Autenticação via token
- **Bcryptjs** – Criptografia de senhas
- **dotenv** – Gerenciamento de variáveis de ambiente
- **Cors** – Habilitar requisições de diferentes origens

---

## Observações

- Todas as queries SQL utilizam **Prepared Statements** (`?`) para prevenir SQL Injection.
- A autenticação é feita via **JWT** (Bearer Token).
- As rotas de produtos e categorias exigem que o usuário esteja autenticado.
- O projeto foi migrado de MongoDB para MySQL como parte de uma atividade acadêmica.

---

## Autor

Desenvolvido como atividade acadêmica de migração de banco de dados.

**GitHub:** [Lotth00](https://github.com/Lotth00)