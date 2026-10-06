# 🌍 SafeTour

O **SafeTour** é uma plataforma web voltada ao turismo seguro, criada para facilitar a descoberta de **pontos turísticos, eventos e estabelecimentos**, reunindo informações importantes sobre cada local e seus respectivos níveis de risco.

O projeto possui frontend e backend completos, autenticação de usuários, diferentes níveis de permissão e integração com banco de dados MongoDB.

---

## ✨ Funcionalidades

- 🔎 Pesquisa de pontos turísticos, eventos e estabelecimentos
- 🗺️ Consulta de informações turísticas
- 📅 Visualização e gerenciamento de eventos
- 🏪 Cadastro e gerenciamento de estabelecimentos
- ⚠️ Gerenciamento de níveis de risco
- 👤 Cadastro e autenticação de usuários
- 🏢 Área exclusiva para instituições
- 🛡️ Painel administrativo para profissionais
- 🔐 Autenticação com JWT
- 📱 Interface responsiva
- 🔌 API REST
- ⚡ API GraphQL
- 🍃 Integração com MongoDB

---

## 👥 Perfis de usuário

O SafeTour possui três tipos de perfil.

### 👤 Turista

Usuário comum da plataforma.

Pode:

- criar uma conta;
- fazer login;
- pesquisar pontos turísticos;
- consultar eventos;
- visualizar estabelecimentos;
- consultar informações de risco.

---

### 🏢 Instituição

Perfil destinado a estabelecimentos e instituições presentes na plataforma.

Pode:

- criar uma conta;
- fazer login;
- cadastrar seu próprio estabelecimento;
- editar as informações do próprio estabelecimento;
- consultar pontos turísticos, eventos e informações de risco.

Cada instituição pode possuir **no máximo um estabelecimento**.

A propriedade do estabelecimento é validada pelo backend utilizando o usuário autenticado.

---

### 🛡️ Profissional

É o perfil administrativo do SafeTour.

Pode:

- cadastrar pontos turísticos;
- editar pontos turísticos;
- excluir pontos turísticos;
- cadastrar eventos;
- editar eventos;
- excluir eventos;
- administrar estabelecimentos;
- definir níveis de risco;
- acessar o painel profissional.

> Não existe cadastro público para o perfil profissional.

Uma conta profissional deve ser criada por meio do procedimento administrativo disponível no backend.

---

## 🔐 Permissões

| Funcionalidade | Visitante | Turista | Instituição | Profissional |
|---|:---:|:---:|:---:|:---:|
| Consultar pontos turísticos | ✅ | ✅ | ✅ | ✅ |
| Consultar eventos | ✅ | ✅ | ✅ | ✅ |
| Consultar estabelecimentos | ✅ | ✅ | ✅ | ✅ |
| Consultar níveis de risco | ✅ | ✅ | ✅ | ✅ |
| Criar pontos turísticos | ❌ | ❌ | ❌ | ✅ |
| Editar pontos turísticos | ❌ | ❌ | ❌ | ✅ |
| Excluir pontos turísticos | ❌ | ❌ | ❌ | ✅ |
| Criar eventos | ❌ | ❌ | ❌ | ✅ |
| Editar eventos | ❌ | ❌ | ❌ | ✅ |
| Excluir eventos | ❌ | ❌ | ❌ | ✅ |
| Criar estabelecimento próprio | ❌ | ❌ | ✅ | ✅ |
| Editar estabelecimento próprio | ❌ | ❌ | ✅ | ✅ |
| Administrar qualquer estabelecimento | ❌ | ❌ | ❌ | ✅ |
| Alterar níveis de risco | ❌ | ❌ | ❌ | ✅ |

---

## 🛠️ Tecnologias utilizadas

### Backend

- Node.js
- Express
- MongoDB
- MongoDB Atlas
- Mongoose
- GraphQL
- JWT
- bcrypt
- dotenv
- CORS

### Frontend

- React
- Vite
- React Router
- Apollo Client
- GraphQL
- CSS

---

## 🏗️ Arquitetura

O projeto possui duas interfaces de comunicação com o backend:

- **REST**
- **GraphQL**

As duas utilizam a mesma camada de regras de negócio.

```text
SafeTour
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

### Backend

```text
controllers/
```

Responsáveis pela comunicação das rotas REST com as regras de negócio.

```text
graphql/
```

Contém schema, resolvers e contexto utilizados pela API GraphQL.

```text
services/
```

Contém as principais regras de negócio e operações com o banco de dados.

```text
middlewares/
```

Responsáveis por autenticação e autorização.

```text
models/
```

Schemas do MongoDB utilizando Mongoose.

```text
routes/
```

Rotas da API REST.

```text
scripts/
```

Scripts administrativos, como a criação de contas profissionais.

---

# 🚀 Como executar o projeto

## Pré-requisitos

Antes de começar, é necessário possuir:

- Node.js instalado
- npm
- MongoDB local ou MongoDB Atlas
- Git

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

# ⚙️ Backend

## 2. Instale as dependências

Na raiz do projeto:

```bash
npm install
```

---

## 3. Configure as variáveis de ambiente

Crie um arquivo:

```text
.env
```

na raiz do projeto.

Utilize o arquivo:

```text
.env.example
```

como referência.

Exemplo:

```env
MONGODB_URI=sua_string_de_conexao
MONGODB_DB=safetour
PORT=3000
JWT_SECRET=sua_chave_secreta
```

> Nunca envie o arquivo `.env` com credenciais reais para o GitHub.

Caso utilize o MongoDB Atlas e a conexão seja recusada, verifique se o IP atual está autorizado em **Network Access**.

---

## 4. Inicie o backend

```bash
npm run dev
```

Quando a aplicação iniciar corretamente:

```text
Servidor: http://localhost:3000
GraphQL: http://localhost:3000/graphql
Health: http://localhost:3000/health
```

---

# 💻 Frontend

Abra outro terminal.

Entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Configure o arquivo:

```text
frontend/.env
```

utilizando:

```text
frontend/.env.example
```

como referência.

Exemplo:

```env
VITE_GRAPHQL_URL=http://localhost:3000/graphql
```

Depois execute:

```bash
npm run dev
```

Por padrão, o Vite disponibilizará a aplicação em um endereço semelhante a:

```text
http://localhost:5173
```

---

# 🛡️ Criando uma conta profissional

Por segurança, contas profissionais não podem ser criadas através do cadastro público.

O cadastro é realizado diretamente pelo backend utilizando o script administrativo do projeto.

## PowerShell

```powershell
$env:PROFISSIONAL_SENHA="sua-senha-segura"; npm run criar-profissional -- "Nome do Profissional" email@exemplo.com
```

## Bash

```bash
PROFISSIONAL_SENHA="sua-senha-segura" npm run criar-profissional -- "Nome do Profissional" email@exemplo.com
```

A senha deve possuir pelo menos **8 caracteres**.

Se já existir uma conta com o e-mail informado, ela poderá ser promovida para o perfil profissional sem apagar os dados existentes.

---

# 🔌 GraphQL

A API GraphQL está disponível em:

```text
POST http://localhost:3000/graphql
```

Entre as principais operações estão:

### Queries

```text
perfil
pontosTuristicos
pontoTuristico
eventos
evento
estabelecimentos
estabelecimento
areasDeRisco
meuEstabelecimento
```

### Mutations

```text
cadastrar
login
loginProfissional
atualizarPerfil
excluirPerfil

cadastrarPontoTuristico
atualizarPontoTuristico
excluirPontoTuristico

cadastrarEvento
atualizarEvento
excluirEvento

cadastrarEstabelecimento
atualizarEstabelecimento
excluirEstabelecimento

definirNivelRiscoPontoTuristico
definirNivelRiscoEvento
```

---

# 🌐 API REST

O backend também disponibiliza uma API REST.

## Autenticação

```text
POST /auth/cadastro
POST /auth/login
POST /auth/login-profissional
```

## Usuário

```text
GET    /usuarios/me
PUT    /usuarios/me
DELETE /usuarios/me
```

## Pontos turísticos

```text
GET    /pontos-turisticos
GET    /pontos-turisticos/:id
POST   /pontos-turisticos
PUT    /pontos-turisticos/:id
DELETE /pontos-turisticos/:id
```

## Eventos

```text
GET    /eventos
GET    /eventos/:id
POST   /eventos
PUT    /eventos/:id
DELETE /eventos/:id
```

## Estabelecimentos

```text
GET    /estabelecimentos
GET    /estabelecimentos/:id
POST   /estabelecimentos
PUT    /estabelecimentos/:id
DELETE /estabelecimentos/:id
```

---

# 🔑 Autenticação JWT

Após o login, o servidor retorna um token JWT.

Nas rotas REST protegidas, envie o token através do cabeçalho:

```text
Authorization: Bearer SEU_TOKEN
```

O token possui tempo de expiração.

No frontend, a autenticação é gerenciada automaticamente pela aplicação.

---

# 🔒 Regras de segurança

O SafeTour possui regras de autorização aplicadas no backend.

Entre elas:

- instituições só podem editar o próprio estabelecimento;
- uma instituição não pode possuir mais de um estabelecimento;
- o proprietário do estabelecimento é determinado através do usuário autenticado;
- o frontend não pode escolher livremente quem é o proprietário de um estabelecimento;
- somente profissionais podem administrar pontos turísticos e eventos;
- somente profissionais podem alterar níveis de risco;
- contas profissionais não podem ser criadas pelo cadastro público;
- o login profissional é separado do login comum;
- a exclusão de perfil não remove pontos turísticos nem eventos administrativos.

---

# 🗄️ Banco de dados

O projeto utiliza:

```text
MongoDB
```

com:

```text
Mongoose
```

para modelagem e acesso aos dados.

O sistema pode utilizar tanto uma instância local quanto o:

```text
MongoDB Atlas
```

---

# 📱 Interface

O frontend foi desenvolvido com foco em uma experiência moderna de turismo.

A aplicação possui:

- página inicial;
- busca;
- listagem de pontos turísticos;
- listagem de eventos;
- listagem de estabelecimentos;
- cadastro;
- login;
- acesso profissional;
- área de gerenciamento da instituição;
- painel profissional;
- tratamento de páginas inexistentes;
- estados de carregamento;
- mensagens de erro e sucesso;
- layout responsivo.

---

# 🧪 Testes

O projeto possui um guia adicional de testes em:

```text
frontend/TESTES.md
```

Antes da entrega ou publicação de uma nova versão, recomenda-se validar:

- cadastro de turista;
- cadastro de instituição;
- login;
- login profissional;
- proteção das rotas;
- criação e edição de estabelecimento;
- CRUD de pontos turísticos;
- CRUD de eventos;
- gerenciamento de níveis de risco;
- busca;
- responsividade;
- build do frontend.

Para validar o build do frontend:

```bash
cd frontend
npm run build
```

---

# 📌 Principais regras de negócio

### Turista

Pode consumir o conteúdo da plataforma, mas não pode realizar operações administrativas.

### Instituição

Pode possuir apenas um estabelecimento e administrar somente esse estabelecimento.

### Profissional

Possui acesso administrativo global e é responsável pelo gerenciamento de pontos turísticos, eventos, estabelecimentos e níveis de risco.

---

# 📄 Licença

Este projeto está licenciado sob a licença **MIT**.

Consulte o arquivo:

```text
LICENSE
```

para mais informações.

---

# 🌍 SafeTour

**Turismo, informação e segurança em um só lugar.**
