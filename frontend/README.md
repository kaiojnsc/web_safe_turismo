# SafeTour — Frontend

React + Vite + React Router + Apollo Client, consumindo a API GraphQL do backend. Visual de plataforma de turismo (verde como cor principal, cards, imagens em `public/img`).

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

`npm run build` gera a versão de produção em `dist/`.

## Rotas

| Rota                   | Acesso                                   | O que é                                                  |
|------------------------|------------------------------------------|----------------------------------------------------------|
| `/`                    | Público                                  | Home de descoberta (busca, pontos, eventos, estabelecimentos, segurança) |
| `/busca?q=...&tipo=...`| Público                                  | Busca real (`tipo` = `pontos`, `eventos` ou `estabelecimentos`) |
| `/pontos-turisticos`   | Público                                  | Cards com filtro por texto e risco                       |
| `/eventos`             | Público                                  | Idem, ordenados por data                                 |
| `/estabelecimentos`    | Público                                  | Cards com filtro por nome, cidade e categoria            |
| `/login`               | Público                                  | Login de turista e instituição                           |
| `/cadastro`            | Público                                  | Cadastro de turista ou instituição (nunca profissional)  |
| `/acesso-profissional` | Público (é login, não cadastro)          | Login do administrador                                   |
| `/meu-estabelecimento` | Somente instituição                      | Cadastrar/editar o próprio estabelecimento (com geolocalização) |
| `/profissional`        | Somente profissional                     | Painel do administrador (`?aba=pontos|eventos|estabelecimentos|riscos`) |
| qualquer outra         | —                                        | Página 404                                               |

Depois do login: turista → `/`, instituição → `/meu-estabelecimento`, profissional → `/profissional`. Quem já está logado e abre `/login` ou `/cadastro` é redirecionado para a sua área.

A proteção das rotas é só experiência de uso: quem realmente bloqueia o acesso é o backend, em cada operação GraphQL.

## Perfis

- **turista**: consulta tudo o que é público.
- **instituicao**: consulta e gerencia **um** estabelecimento próprio.
- **profissional**: administrador global (pontos, eventos, estabelecimentos e níveis de risco). Não há cadastro público; a conta é criada no servidor com `npm run criar-profissional` (veja o README da raiz).

## Sessão

O token JWT e os dados do usuário ficam no `localStorage` (nunca a senha). Ao abrir o site, o `AuthContext` confirma a sessão no servidor (`perfil`) enquanto as rotas protegidas mostram "Carregando...", sem piscar a tela de login. A sessão é encerrada sozinha quando o token expira (2 h).

## Estrutura

```
src/
├── components/   Navbar, Footer, Loading, ErrorMessage, SuccessMessage, RotaProtegida,
│                 CardLugar, BuscaHero, Icon, RiscoSelect, PainelRisco, EstabelecimentoForm,
│                 PontoTuristicoForm/List/Item, EventoForm/List/Item
├── context/      AuthContext (usuário logado, perfil, carregando)
├── graphql/      queries.js e mutations.js (mesmos nomes do schema do backend)
├── pages/        Home, Busca, Login (também /acesso-profissional), Cadastro, PontosTuristicos,
│                 Eventos, Estabelecimentos, MeuEstabelecimento, Profissional, NotFound
├── services/     apollo.js (envia o token) e auth.js (guarda o token)
├── utils/        helpers.js (busca sem acento, datas, imagens)
├── App.jsx       rotas
├── main.jsx      ApolloProvider + AuthProvider
└── index.css     sistema de design global
```

`PontosTuristicos`, `Eventos` e `Estabelecimentos` aceitam a prop `embutido`, usada pelo Painel profissional para reaproveitar as mesmas telas.

Os testes estão em [TESTES.md](TESTES.md).
