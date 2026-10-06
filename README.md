# 🌍 SafeTour

O **SafeTour** é uma plataforma web de turismo seguro desenvolvida com React, Node.js, GraphQL e MongoDB.

O sistema permite consultar pontos turísticos, eventos e estabelecimentos, além de possuir autenticação e diferentes perfis de usuário.

## 🛠 Tecnologias

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- GraphQL
- JWT

### Frontend
- React
- Vite
- Apollo Client
- React Router

---

# 🚀 Como executar o projeto

## Pré-requisitos

Antes de começar, tenha instalado:

- Node.js
- npm
- Git
- MongoDB local ou uma conta no MongoDB Atlas

---

## 1. Clone o repositório

```bash
git clone https://github.com/kaiojnsc/web_safe_turismo.git
```

Entre na pasta:

```bash
cd web_safe_turismo
```

---

## 2. Configure o backend

Na raiz do projeto, instale as dependências:

```bash
npm install
```

Crie um arquivo chamado:

```text
.env
```

Use o arquivo `.env.example` como referência.

Exemplo:

```env
MONGODB_URI=sua_string_de_conexao
MONGODB_DB=safetour
PORT=3000
JWT_SECRET=sua_chave_secreta
```

> Não envie o arquivo `.env` com credenciais reais para o GitHub.

Se estiver utilizando o MongoDB Atlas, certifique-se de que o seu IP está autorizado em **Network Access**.

Depois, inicie o backend:

```bash
npm run dev
```

Se tudo estiver correto, o servidor ficará disponível em:

```text
http://localhost:3000
```

GraphQL:

```text
http://localhost:3000/graphql
```

Health check:

```text
http://localhost:3000/health
```

---

## 3. Configure o frontend

Abra outro terminal e entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo:

```text
frontend/.env
```

Use `frontend/.env.example` como referência.

Exemplo:

```env
VITE_GRAPHQL_URL=http://localhost:3000/graphql
```

Depois execute:

```bash
npm run dev
```

O Vite mostrará no terminal o endereço da aplicação, normalmente:

```text
http://localhost:5173
```

Acesse esse endereço pelo navegador.

---

# 🛡️ Conta profissional

O perfil profissional não pode ser criado pelo cadastro comum da aplicação.

Para criar uma conta profissional pelo PowerShell:

```powershell
$env:PROFISSIONAL_SENHA="sua-senha-segura"; npm run criar-profissional -- "Nome do Profissional" email@exemplo.com
```

A senha deve possuir pelo menos 8 caracteres.

---

# ▶️ Resumo rápido

Use dois terminais.

### Terminal 1 — Backend

```bash
npm install
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Depois acesse:

```text
http://localhost:5173
```

---

# 📄 Licença

Este projeto utiliza a licença MIT.
