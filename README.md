# SafeTour

Aplicação web do projeto SafeTour, desenvolvida com **Node.js + Express + MongoDB + GraphQL** no backend e **React + Vite + Apollo Client** no frontend.

## Como rodar

### Backend

Na raiz do projeto, instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` a partir do `.env.example`:

```env
MONGODB_URI=sua_string_de_conexao
MONGODB_DB=safetour
PORT=3000
JWT_SECRET=sua_chave_secreta
```

Se estiver usando o MongoDB Atlas, certifique-se de que o seu IP atual está autorizado em **Network Access**.

Depois execute:

```bash
npm run dev
```

O backend ficará disponível em:

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

### Frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `frontend/.env` a partir do `frontend/.env.example`:

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

## Perfis

O sistema possui três perfis:

- `turista`: cadastro público e acesso às informações da plataforma;
- `instituicao`: cadastro público e gerenciamento do próprio estabelecimento;
- `profissional`: perfil administrativo do SafeTour.

Não existe cadastro público para o perfil `profissional`.

## Criando uma conta profissional

A conta profissional deve ser criada pelo backend.

No PowerShell:

```powershell
$env:PROFISSIONAL_SENHA="uma-senha-forte"; npm run criar-profissional -- "Nome" email@exemplo.com
```

A senha deve possuir pelo menos 8 caracteres.

## Observações

Os arquivos `.env` não são enviados para o repositório. Use os arquivos `.env.example` como referência para configurar o projeto localmente.

Para executar o sistema, mantenha o backend e o frontend rodando simultaneamente em terminais separados.
