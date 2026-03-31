--- README.md


+++ README.md
# API REST - Gerenciamento de Usuários

Uma API RESTful simples para gerenciamento de usuários, construída com **Express** e **TypeScript**.

## 🚀 Funcionalidades

- ✅ Criar usuário
- ✅ Listar todos os usuários
- ✅ Buscar usuário por ID
- ✅ Atualizar usuário
- ✅ Deletar usuário
- ✅ Validação de dados (nome, email)
- ✅ Tratamento de erros centralizado

## 📋 Requisitos

- Node.js (v14 ou superior)
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório ou navegue até a pasta do projeto:
```bash
cd /workspace
```

2. Instale as dependências:
```bash
npm install
```

## ▶️ Como Rodar

### Iniciar o servidor de desenvolvimento:
```bash
npm start
```

O servidor irá rodar em `http://localhost:3000` por padrão.

### Build para produção:
```bash
npm run build
```

### Rodar testes:
```bash
npm test
```

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/users` | Criar um novo usuário |
| `GET` | `/api/users` | Listar todos os usuários |
| `GET` | `/api/users/:id` | Buscar usuário por ID |
| `PUT` | `/api/users/:id` | Atualizar usuário |
| `DELETE` | `/api/users/:id` | Deletar usuário |
| `GET` | `/` | Health check |

## 📝 Exemplos de Uso

### Criar um usuário
```http
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "name": "Maria",
  "email": "maria@example.com"
}
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "name": "Maria",
  "email": "maria@example.com",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

### Listar todos os usuários
```http
GET http://localhost:3000/api/users
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Maria",
    "email": "maria@example.com",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
]
```

### Buscar usuário por ID
```http
GET http://localhost:3000/api/users/1
```

### Atualizar usuário
```http
PUT http://localhost:3000/api/users/1
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria.silva@example.com"
}
```

### Deletar usuário
```http
DELETE http://localhost:3000/api/users/1
```

**Resposta (204 No Content)**

## ⚠️ Validações

- **Nome**: Obrigatório, não pode ser vazio
- **Email**: Obrigatório, deve seguir formato válido (ex: `usuario@dominio.com`)

## 🔧 Estrutura do Projeto

```
/workspace
├── api.ts              # Código principal da API (rotas, controllers, repository)
├── package.json        # Dependências e scripts
├── tsconfig.json       # Configuração do TypeScript
├── server.test.ts      # Testes da API
├── teste.http          # Exemplos de requisições HTTP
└── README.md           # Este arquivo
```

## 🧪 Testes

Os testes são feitos com **Jest** e **Supertest**. Execute:

```bash
npm test
```

## 📦 Dependências

### Produção:
- `express` - Framework web

### Desenvolvimento:
- `typescript` - Superset do JavaScript
- `ts-node` - Execução de TypeScript
- `jest` + `ts-jest` - Framework de testes
- `supertest` - Testes de API HTTP
- `@types/*` - Definições de tipos

## 🔐 Tratamento de Erros

A API retorna os seguintes códigos de status:

| Código | Descrição |
|--------|-----------|
| `200` | Requisição bem-sucedida |
| `201` | Recurso criado com sucesso |
| `204` | Recurso deletado com sucesso |
| `400` | Dados inválidos |
| `404` | Recurso não encontrado |
| `500` | Erro interno do servidor |

## 📄 Licença

Este projeto é de uso privado.

---

**Desenvolvido com TypeScript e Express** 🚀
