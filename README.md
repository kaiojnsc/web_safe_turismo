# SafeTour API

API do projeto SafeTour (Node.js + Express + MongoDB + JWT).

## Como rodar

```
npm install
cp .env.example .env
```

Preencha o `.env` com a string de conexão do MongoDB Atlas e uma chave para o JWT.

```
npm run dev
```

## Endpoints

| Método | Rota                  | Acesso                     |
|--------|-----------------------|-----------------------------|
| POST   | /auth/cadastro         | Público                     |
| POST   | /auth/login            | Público                     |
| POST   | /pontos-turisticos     | Somente profissional        |
| GET    | /pontos-turisticos     | Turista e profissional      |
| GET    | /pontos-turisticos/:id | Turista e profissional      |
| PUT    | /pontos-turisticos/:id | Somente profissional        |
| DELETE | /pontos-turisticos/:id | Somente profissional        |
| POST   | /eventos               | Somente profissional        |
| GET    | /eventos               | Turista e profissional      |
| GET    | /eventos/:id           | Turista e profissional      |
| PUT    | /eventos/:id           | Somente profissional        |
| DELETE | /eventos/:id           | Somente profissional        |
