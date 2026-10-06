# SafeTour

Aplicação web voltada ao turismo seguro, desenvolvida com **Node.js + Express + MongoDB + GraphQL** no backend e **React + Vite + Apollo Client** no frontend.

O SafeTour permite consultar pontos turísticos, eventos e estabelecimentos, além de disponibilizar informações de risco e diferentes níveis de acesso para turistas, instituições e profissionais.

## Funcionalidades

- Consulta de pontos turísticos, eventos e estabelecimentos
- Busca integrada de conteúdos da plataforma
- Cadastro e autenticação de usuários
- Gerenciamento de estabelecimentos por instituições
- Painel administrativo para profissionais
- Gerenciamento de níveis de risco
- API REST e GraphQL
- Interface responsiva

## Tecnologias

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- GraphQL
- JWT
- bcrypt

### Frontend

- React
- Vite
- Apollo Client
- React Router
- CSS

## Como rodar

### Pré-requisitos

Antes de iniciar, é necessário possuir:

- Node.js
- npm
- MongoDB local ou MongoDB Atlas
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/kaiojnsc/web_safe_turismo.git
cd web_safe_turismo
```

### 2. Backend

Na raiz do projeto, instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` utilizando o `.env.example` como referência:

```env
MONGODB_URI=sua_string_de_conexao
MONGODB_DB=safetour
PORT=3000
JWT_SECRET=sua_chave_secreta
```

> Não envie o arquivo `.env` com credenciais reais para o repositório.

Se estiver utilizando o MongoDB Atlas e a conexão for recusada, verifique se o seu IP atual está autorizado em **Network Access**.

Inicie o backend:

```bash
npm run dev
```

Com o servidor em execução:

```text
Servidor: http://localhost:3000
GraphQL: http://localhost:3000/graphql
Health: http://localhost:3000/health
```

### 3. Frontend

Abra outro terminal e entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `frontend/.env` utilizando `frontend/.env.example` como referência:

```env
VITE_GRAPHQL_URL=http://localhost:3000/graphql
```

Inicie o frontend:

```bash
npm run dev
```

O Vite mostrará no terminal o endereço da aplicação, normalmente:

```text
http://localhost:5173
```

Para utilizar o sistema, mantenha **backend e frontend rodando simultaneamente em terminais separados**.

## Perfis

Existem três perfis no SafeTour:

| Perfil | Descrição |
|---|---|
| `turista` | Usuário que consulta pontos turísticos, eventos, estabelecimentos e informações da plataforma |
| `instituicao` | Pode cadastrar e administrar o próprio estabelecimento |
| `profissional` | Perfil administrativo responsável pelo gerenciamento global do conteúdo |

### Turista

O turista pode criar uma conta pela própria aplicação e acessar o conteúdo público do SafeTour.

### Instituição

A instituição também possui cadastro público e pode cadastrar **no máximo um estabelecimento**, podendo editar apenas o estabelecimento vinculado à própria conta.

### Profissional

O profissional possui acesso administrativo ao sistema e pode gerenciar pontos turísticos, eventos, estabelecimentos e níveis de risco.

Não existe cadastro público para contas profissionais.

## Criando uma conta profissional

A conta profissional deve ser criada através do script administrativo do backend.

### PowerShell

```powershell
$env:PROFISSIONAL_SENHA="uma-senha-forte"; npm run criar-profissional -- "Nome" email@exemplo.com
```

### Bash

```bash
PROFISSIONAL_SENHA="uma-senha-forte" npm run criar-profissional -- "Nome" email@exemplo.com
```

A senha deve possuir pelo menos **8 caracteres**.

Se o e-mail informado já existir, a conta poderá ser promovida para o perfil `profissional` sem apagar os dados existentes.

## APIs

O backend disponibiliza duas interfaces para acesso às funcionalidades do sistema:

### REST

As rotas REST são organizadas em:

```text
/auth
/usuarios
/pontos-turisticos
/eventos
/estabelecimentos
```

### GraphQL

O endpoint GraphQL está disponível em:

```text
http://localhost:3000/graphql
```

O frontend utiliza principalmente essa interface através do Apollo Client.

## Estrutura do projeto

```text
web_safe_turismo/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── graphql/
│       ├── pages/
│       ├── services/
│       └── utils/
│
├── src/
│   ├── controllers/
│   ├── graphql/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   └── utils/
│
├── .env.example
├── package.json
└── README.md
```

## Build do frontend

Para verificar a versão de produção do frontend:

```bash
cd frontend
npm run build
```

## Observações

- Os arquivos `.env` não devem ser enviados para o GitHub.
- Utilize sempre os arquivos `.env.example` como referência.
- Backend e frontend devem estar em execução ao mesmo tempo durante o desenvolvimento.
- Contas profissionais não são criadas através do cadastro público.
- O MongoDB Atlas pode exigir a autorização do IP atual antes de aceitar conexões.

## Licença

Este projeto utiliza a licença **MIT**.
