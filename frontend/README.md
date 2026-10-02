# SafeTour — Frontend

React + Vite consumindo a API GraphQL do backend com Apollo Client.

## Como rodar

1. Deixe o backend rodando na raiz do projeto (`npm run dev`). Ele deve mostrar `GraphQL: http://localhost:3000/graphql`.
2. Em outro terminal:

```
cd frontend
npm install
cp .env.example .env
npm run dev
```

3. Abra `http://localhost:5173`.

## Login

As listagens exigem login, porque o backend pede o token JWT. Clique em **Entrar** na barra superior.

- Usuário **turista**: só visualiza pontos turísticos e eventos.
- Usuário **profissional**: também cadastra, edita e exclui.

Os usuários são criados pela API (`POST /auth/cadastro`), como no README da raiz.

## Estrutura

```
src/
├── components/   Navbar, Loading, ErrorMessage, LoginNecessario,
│                 PontoTuristicoForm/List/Item, EventoForm/List/Item
├── context/      AuthContext (usuário logado)
├── graphql/      queries.js e mutations.js (mesmos nomes do schema do backend)
├── pages/        Home, Login, PontosTuristicos, Eventos
├── services/     apollo.js (envia o token) e auth.js (guarda o token)
├── App.jsx       rotas
├── main.jsx      ApolloProvider + AuthProvider
└── index.css     estilos globais
```

Os testes manuais estão em [TESTES.md](TESTES.md).
