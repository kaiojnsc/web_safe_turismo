# SafeTour API

API do projeto SafeTour (Node.js + Express + MongoDB + JWT), com duas interfaces expostas em paralelo sobre o mesmo domínio: **REST** e **GraphQL**. O frontend (React + Vite + Apollo Client) está em [frontend/](frontend/README.md) e usa o GraphQL.

## Como rodar

```
npm install
cp .env.example .env
```

Preencha o `.env` com a string de conexão do MongoDB (Atlas ou local) e uma chave para o JWT. Se o Atlas recusar a conexão, libere o seu IP atual em *Network Access* no painel do Atlas.

```
npm run dev
```

O token JWT (emitido no login, REST ou GraphQL) expira em 2 horas e deve ser enviado como:

```
Authorization: Bearer <token>
```

## Perfis

Existem exatamente três perfis:

| Perfil        | Quem é                                         | Como obtém a conta                       |
|---------------|------------------------------------------------|------------------------------------------|
| `turista`     | Visitante que consulta o conteúdo               | Cadastro público (`/cadastro`)           |
| `instituicao` | Estabelecimento (no máximo **um** por conta)    | Cadastro público (`/cadastro`)           |
| `profissional`| **Administrador global** do SafeTour            | Somente por procedimento administrativo  |

**Não existe cadastro público de profissional.** O backend recusa `perfil: "profissional"` (ou qualquer valor fora de `turista`/`instituicao`) no cadastro, tanto no REST quanto no GraphQL. Não existe um perfil `admin` separado.

### Criando uma conta profissional

Use o script administrativo no servidor. A senha vem de uma variável de ambiente (nunca fica no código nem no histórico do repositório):

```powershell
# PowerShell
$env:PROFISSIONAL_SENHA="uma-senha-forte"; npm run criar-profissional -- "Nome" email@exemplo.com
```

```bash
# Bash
PROFISSIONAL_SENHA="uma-senha-forte" npm run criar-profissional -- "Nome" email@exemplo.com
```

Se o e-mail já existir, a conta é promovida a `profissional` (nenhum dado é apagado). A senha precisa ter pelo menos 8 caracteres.

### Permissões

| Ação                                                        | Visitante | Turista | Instituição        | Profissional |
|-------------------------------------------------------------|:---------:|:-------:|:------------------:|:------------:|
| Consultar pontos, eventos, estabelecimentos, áreas de risco  | ✅        | ✅      | ✅                 | ✅           |
| Criar/editar/excluir pontos turísticos e eventos             | ❌        | ❌      | ❌                 | ✅           |
| Alterar nível de risco                                       | ❌        | ❌      | ❌                 | ✅           |
| Criar o próprio estabelecimento                              | ❌        | ❌      | ✅ (apenas 1)      | ✅           |
| Editar estabelecimento                                       | ❌        | ❌      | ✅ (só o próprio)  | ✅ (qualquer)|
| Excluir estabelecimento                                      | ❌        | ❌      | ❌                 | ✅           |

Regras de segurança aplicadas **no backend**:

- O dono de um estabelecimento (`criadoPor`) é sempre o usuário autenticado; o schema nem aceita esse campo no input.
- O perfil usado nas autorizações é o gravado no banco no momento da requisição (não o do token). Conta excluída perde o acesso imediatamente.
- `loginProfissional` só concede acesso se `perfil === "profissional"`; o login comum recusa contas profissionais.
- Uma instituição não consegue criar um segundo estabelecimento, nem repetindo a mutation ou disparando requisições simultâneas.
- `criadoPor` aparece publicamente apenas como `{ id, nome, perfil }` (o tipo `Autor`), nunca com e-mail.
- `excluirPerfil` **não apaga** pontos turísticos nem eventos. Apaga apenas o estabelecimento da própria instituição que está excluindo a conta. Contas profissionais não se auto-excluem.

## REST

| Método | Rota                       | Acesso                                         |
|--------|----------------------------|------------------------------------------------|
| POST   | /auth/cadastro             | Público (somente turista ou instituição)       |
| POST   | /auth/login                | Público                                        |
| POST   | /auth/login-profissional   | Público (só entra quem é profissional)         |
| GET    | /usuarios/me               | Autenticado (próprio perfil)                   |
| PUT    | /usuarios/me               | Autenticado (próprio perfil)                   |
| DELETE | /usuarios/me               | Autenticado (turista e instituição)            |
| POST   | /pontos-turisticos         | Somente profissional                           |
| GET    | /pontos-turisticos         | Autenticado                                    |
| GET    | /pontos-turisticos/:id     | Autenticado                                    |
| PUT    | /pontos-turisticos/:id     | Somente profissional                           |
| DELETE | /pontos-turisticos/:id     | Somente profissional                           |
| POST   | /eventos                   | Somente profissional                           |
| GET    | /eventos                   | Autenticado                                    |
| GET    | /eventos/:id               | Autenticado                                    |
| PUT    | /eventos/:id               | Somente profissional                           |
| DELETE | /eventos/:id               | Somente profissional                           |
| POST   | /estabelecimentos          | Instituição (1 por conta) e profissional       |
| GET    | /estabelecimentos          | Autenticado                                    |
| GET    | /estabelecimentos/:id      | Autenticado                                    |
| PUT    | /estabelecimentos/:id      | Instituição (só o próprio) e profissional      |
| DELETE | /estabelecimentos/:id      | Somente profissional                           |

## GraphQL

Endpoint único: `POST /graphql`. Schema completo em [src/graphql/schema.js](src/graphql/schema.js).

```
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(input: { email: \"a@a.com\", senha: \"123456\" }) { token mensagem } }"}'
```

| Operação                                              | Tipo     | Acesso                                     |
|-------------------------------------------------------|----------|--------------------------------------------|
| cadastrar                                             | Mutation | Público (turista ou instituição)           |
| login                                                 | Mutation | Público (turista e instituição)            |
| loginProfissional                                     | Mutation | Público (só entra quem é profissional)     |
| perfil                                                | Query    | Autenticado                                |
| atualizarPerfil                                       | Mutation | Autenticado                                |
| excluirPerfil                                         | Mutation | Turista e instituição                      |
| pontosTuristicos / pontoTuristico                     | Query    | **Público**                                |
| eventos / evento                                      | Query    | **Público**                                |
| estabelecimentos / estabelecimento                    | Query    | **Público**                                |
| areasDeRisco                                          | Query    | **Público**                                |
| meuEstabelecimento                                    | Query    | Autenticado (devolve o da própria conta)   |
| cadastrarPontoTuristico / atualizar / excluir         | Mutation | Somente profissional                       |
| cadastrarEvento / atualizar / excluir                 | Mutation | Somente profissional                       |
| definirNivelRiscoPontoTuristico / definirNivelRiscoEvento | Mutation | Somente profissional                   |
| cadastrarEstabelecimento                              | Mutation | Instituição (1 por conta) e profissional   |
| atualizarEstabelecimento                              | Mutation | Instituição (só o próprio) e profissional  |
| excluirEstabelecimento                                | Mutation | Somente profissional                       |

## Para teste do QA

Guia rápido para testar no Postman. O resto das rotas segue a mesma lógica (veja as tabelas acima).

### Como usar o token JWT no Postman

1. Faça login primeiro (exemplo #3 abaixo). A resposta vem com um campo `token`.
2. Copie esse valor.
3. Nas próximas requisições que precisam de login, vá na aba **Authorization**, escolha **Bearer Token** e cole o token (sem escrever "Bearer").
4. O token expira em **2 horas**. Se um teste que funcionava começar a voltar `401`, faça login de novo.
5. Dica: crie um Environment com a variável `token` e, na aba **Tests** do login, adicione `pm.environment.set("token", pm.response.json().token);`.

### Exemplos de requisições

**1. Cadastrar um turista** `POST /auth/cadastro`

```json
{ "nome": "Kaio", "email": "kaio@teste.com", "senha": "123456" }
```
Sem o campo `perfil`, o cadastro cai como `turista`. Para uma instituição envie `"perfil": "instituicao"`.

**2. Tentar cadastrar um profissional** `POST /auth/cadastro`

```json
{ "nome": "Kill", "email": "kill@teste.com", "senha": "123456", "perfil": "profissional" }
```
Deve retornar `403` ("Não é possível criar uma conta profissional pelo cadastro público"). Contas profissionais são criadas com `npm run criar-profissional` (veja acima).

**3. Login** `POST /auth/login` (turista/instituição) ou `POST /auth/login-profissional` (profissional)

```json
{ "email": "kaio@teste.com", "senha": "123456" }
```

**4. Criar um ponto turístico (precisa ser profissional)** `POST /pontos-turisticos`

```json
{ "nome": "Açude Velho", "descricao": "Cartão-postal da cidade", "categoria": "lazer", "endereco": "Centro" }
```
Só `nome` e `descricao` são obrigatórios.

**5. Mesma requisição do #4 com o token de um turista ou instituição** deve dar `403` ("Usuário não possui permissão").

## Arquitetura

REST e GraphQL são só a camada de transporte: as duas expõem a mesma lógica de domínio, que vive em `src/services/*` (validação, regras de negócio, acesso ao banco). Autenticação (JWT) e autorização por perfil (`turista`/`instituicao`/`profissional`) seguem a mesma regra nos dois.

```
src/
├── controllers/   # tradução HTTP (REST) <-> services
├── graphql/        # schema, resolvers e contexto (GraphQL) <-> services
├── services/       # regras de negócio e acesso ao banco, compartilhado
├── middlewares/    # authMiddleware (REST)
├── models/          # schemas Mongoose
├── routes/          # rotas REST
├── scripts/         # criarProfissional (procedimento administrativo)
└── utils/            # AppError, geração/validação de JWT, tratamento de erro REST
```
