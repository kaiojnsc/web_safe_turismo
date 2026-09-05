# SafeTour API

API do projeto SafeTour (Node.js + Express + MongoDB + JWT), com duas interfaces expostas em paralelo sobre o mesmo domínio: **REST** e **GraphQL**.

## Como rodar

```
npm install
cp .env.example .env
```

Preencha o `.env` com a string de conexão do MongoDB Atlas e uma chave para o JWT.

```
npm run dev
```

O token JWT (emitido no login, REST ou GraphQL) expira em 2 horas e deve ser enviado como:

```
Authorization: Bearer <token>
```

## REST

| Método | Rota                  | Acesso                                  |
|--------|-----------------------|-------------------------------------------|
| POST   | /auth/cadastro         | Público                                   |
| POST   | /auth/login            | Público                                   |
| GET    | /usuarios/me           | Turista e profissional (próprio perfil)   |
| PUT    | /usuarios/me           | Turista e profissional (próprio perfil)   |
| DELETE | /usuarios/me           | Turista e profissional (próprio perfil)   |
| POST   | /pontos-turisticos     | Somente profissional                      |
| GET    | /pontos-turisticos     | Turista e profissional                    |
| GET    | /pontos-turisticos/:id | Turista e profissional                    |
| PUT    | /pontos-turisticos/:id | Somente profissional                      |
| DELETE | /pontos-turisticos/:id | Somente profissional                      |
| POST   | /eventos               | Somente profissional                      |
| GET    | /eventos               | Turista e profissional                    |
| GET    | /eventos/:id           | Turista e profissional                    |
| PUT    | /eventos/:id           | Somente profissional                      |
| DELETE | /eventos/:id           | Somente profissional                      |

## GraphQL

Endpoint único: `POST /graphql`. Schema completo em [src/graphql/schema.js](src/graphql/schema.js).

Teste com o cliente GraphQL do Postman/Insomnia, ou `curl`:

```
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(input: { email: \"a@a.com\", senha: \"123456\" }) { token mensagem } }"}'
```

| Operação                          | Tipo     | Acesso                                  |
|-------------------------------------|----------|-------------------------------------------|
| cadastrar                           | Mutation | Público                                    |
| login                                | Mutation | Público                                    |
| perfil                               | Query    | Turista e profissional (próprio perfil)    |
| atualizarPerfil                      | Mutation | Turista e profissional (próprio perfil)    |
| excluirPerfil                        | Mutation | Turista e profissional (próprio perfil)    |
| pontosTuristicos / pontoTuristico    | Query    | Turista e profissional                     |
| cadastrarPontoTuristico              | Mutation | Somente profissional                       |
| atualizarPontoTuristico              | Mutation | Somente profissional                       |
| excluirPontoTuristico                | Mutation | Somente profissional                       |
| eventos / evento                     | Query    | Turista e profissional                     |
| cadastrarEvento                      | Mutation | Somente profissional                       |
| atualizarEvento                      | Mutation | Somente profissional                       |
| excluirEvento                        | Mutation | Somente profissional                       |

## Para teste do QA

Esse é um guia rápido pra começar a testar no Postman — não tem todos os
endpoints aqui, só alguns exemplos pra você pegar o padrão dos campos. O
resto das rotas segue a mesma lógica (dá pra ver a lista completa nas tabelas
de REST e GraphQL acima).

### Como usar o token JWT no Postman

1. Faça login primeiro (exemplo #3 abaixo). A resposta vem com um campo
   `token`.
2. Copie esse valor.
3. Nas próximas requisições que precisam de login, vá na aba **Authorization**
   da requisição no Postman, escolha o tipo **Bearer Token** e cole o token
   ali (sem escrever a palavra "Bearer", o Postman já adiciona sozinho).
   - Se preferir montar na mão, dá no mesmo: aba **Headers**, chave
     `Authorization`, valor `Bearer <token colado aqui>`.
4. O token expira em **2 horas**. Se um teste que funcionava começar a
   voltar `401` do nada, provavelmente é só o token vencendo — faça login de
   novo e pega um token fresco.
5. Dica: crie um Environment no Postman com uma variável `token` e, na aba
   **Tests** da requisição de login, adicione
   `pm.environment.set("token", pm.response.json().token);` — assim o token
   é salvo sozinho a cada login, sem precisar copiar e colar toda hora.

### Exemplos de requisições

**1. Cadastrar um turista** — `POST /auth/cadastro`

```json
{
  "nome": "Kaio",
  "email": "kaio@teste.com",
  "senha": "123456"
}
```
Sem o campo `perfil`, o cadastro cai como `turista` por padrão — quem só
pode visualizar pontos turísticos e eventos.

**2. Cadastrar um profissional** — `POST /auth/cadastro`

```json
{
  "nome": "Kill",
  "email": "kill@teste.com",
  "senha": "123456",
  "perfil": "profissional"
}
```
Aqui o `perfil` é enviado explicitamente como `"profissional"` — é esse
usuário que vai conseguir criar, editar e excluir pontos turísticos e
eventos.

**3. Login** — `POST /auth/login`

```json
{
  "email": "kill@teste.com",
  "senha": "123456"
}
```
A resposta traz o `token` — é ele que você vai usar no passo do JWT acima.

**4. Criar um ponto turístico (precisa ser profissional)** — `POST /pontos-turisticos`, com o token do Kill

```json
{
  "nome": "Açude Velho",
  "descricao": "Cartão-postal da cidade, com calçadão e praça ao redor",
  "categoria": "lazer",
  "endereco": "Centro"
}
```
Só `nome` e `descricao` são obrigatórios, o resto é opcional.

**5. Mesma requisição do #4, mas com o token do Kaio (turista)** — deve dar
erro `403` ("Usuário não possui permissão"), porque turista não pode
cadastrar ponto turístico, só visualizar.

Se quiser confirmar isso com um terceiro usuário, cadastre um "Pedro" como
turista (igual ao #1) e repita o teste #5 com o token dele — o resultado
tem que ser o mesmo `403`, pra garantir que a regra vale pra qualquer
turista, não só pro Kaio.

## Arquitetura

REST e GraphQL são só a camada de transporte: as duas expõem a mesma lógica de
domínio, que vive em `src/services/*` (validação, regras de negócio, acesso ao
banco). Autenticação (JWT) e autorização por perfil (`turista`/`profissional`)
seguem a mesma regra nos dois: quem só é turista consulta; só profissional
cria, edita e exclui pontos turísticos e eventos.

```
src/
├── controllers/   # tradução HTTP (REST) <-> services
├── graphql/        # schema, resolvers e contexto (GraphQL) <-> services
├── services/       # regras de negócio e acesso ao banco, compartilhado
├── middlewares/    # authMiddleware (REST)
├── models/          # schemas Mongoose
├── routes/          # rotas REST
└── utils/            # AppError, geração/validação de JWT, tratamento de erro REST
```
