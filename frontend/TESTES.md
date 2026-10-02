# Testes do Frontend — SafeTour (Parte 2)

Responsável: **Pedro** (CSS, testes e integração final)

Fluxo testado: **React → Apollo Client → GraphQL → backend → MongoDB**

Status usado nas tabelas: ✅ passou · ❌ falhou · ⏳ ainda não dá para testar

---

## 1. Operações GraphQL que o frontend deve usar

Elas precisam ter **exatamente** estes nomes e argumentos (tirados de `src/graphql/schema.js`):

**Login (para conseguir o token)**
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) { token mensagem usuario { id nome perfil } }
}
```

**Pontos Turísticos**
```graphql
query { pontosTuristicos { id nome descricao categoria endereco } }

mutation Cadastrar($input: PontoTuristicoInput!) {
  cadastrarPontoTuristico(input: $input) { id nome }
}
mutation Atualizar($id: ID!, $input: AtualizarPontoTuristicoInput!) {
  atualizarPontoTuristico(id: $id, input: $input) { id nome }
}
mutation Excluir($id: ID!) {
  excluirPontoTuristico(id: $id) { mensagem }
}
```
Campos obrigatórios no cadastro: `nome` e `descricao`.

**Eventos**
```graphql
query { eventos { id nome descricao data local } }

mutation Cadastrar($input: EventoInput!) {
  cadastrarEvento(input: $input) { id nome }
}
mutation Atualizar($id: ID!, $input: AtualizarEventoInput!) {
  atualizarEvento(id: $id, input: $input) { id nome }
}
mutation Excluir($id: ID!) {
  excluirEvento(id: $id) { mensagem }
}
```
Campos obrigatórios no cadastro: `nome`, `descricao`, `data` e `local`.

> Observação: as exclusões devolvem `{ mensagem }`, e não um valor simples como no roteiro (`deletarPessoa(id)`). Por isso, a mutation precisa pedir o campo `mensagem`.

---

## 2. Preparação antes de testar

1. Backend rodando: `npm run dev` na raiz (deve aparecer `GraphQL: http://localhost:3000/graphql`).
2. Frontend rodando: `cd frontend` → `npm install` → conferir se o `.env` tem `VITE_GRAPHQL_URL=http://localhost:3000/graphql` → `npm run dev` → abrir `http://localhost:5173`.
3. Ter dois usuários cadastrados (pode ser pelo Postman, como no README):
   - **Turista:** `kaio@teste.com` / `123456`
   - **Profissional:** `kill@teste.com` / `123456` com `"perfil": "profissional"`

---

## 3. Roteiro de testes

### 3.1 Visual (CSS)

| # | O que fazer | Resultado esperado | Status |
|---|-------------|--------------------|--------|
| V1 | Abrir `/` | Navbar escura no topo, Home centralizada | ⏳ |
| V2 | Clicar nos links da Navbar | Troca de página sem recarregar o navegador | ⏳ |
| V3 | Logado como profissional, abrir a página de Pontos Turísticos | Título, botão verde de novo cadastro e tabela com cabeçalho escuro | ⏳ |
| V4 | Clicar no botão de novo cadastro | Formulário branco com borda superior escura | ⏳ |
| V5 | Clicar dentro de um campo | Borda do campo fica escura (foco) | ⏳ |
| V6 | Tentar salvar com campo obrigatório vazio | Navegador bloqueia e o campo fica com borda vermelha | ⏳ |
| V7 | Diminuir a janela para largura de celular (F12 → modo celular) | Nada fica cortado; a tabela rola para o lado | ⏳ |
| V8 | Desligar o backend e recarregar a lista | Aparece a caixa vermelha de erro (ErrorMessage) | ⏳ |
| V9 | Recarregar a lista com a internet lenta (F12 → Network → Slow 3G) | Aparece o spinner "Carregando..." | ⏳ |

### 3.2 GET — listagem

| # | O que fazer | Resultado esperado | Status |
|---|-------------|--------------------|--------|
| G1 | Logado como turista, abrir Pontos Turísticos | Lista aparece (ou a mensagem de "nenhum cadastrado") | ⏳ |
| G2 | Logado como turista, abrir Eventos | Lista aparece | ⏳ |
| G3 | **Sem login**, abrir Pontos Turísticos | Aparece um aviso para fazer login (ou o erro "Usuário não autenticado"), sem a tela quebrar | ⏳ |
| G4 | Banco sem nenhum registro | Mensagem "Nenhum ... cadastrado" em vez de tabela vazia | ⏳ |
| G5 | Entrar com senha errada | Aparece "Email ou senha inválidos" | ⏳ |

### 3.3 CREATE — cadastro

| # | O que fazer | Resultado esperado | Status |
|---|-------------|--------------------|--------|
| C1 | Como **profissional**, cadastrar o ponto "Açude Velho", com descrição "Cartão-postal da cidade" | Aparece na lista sem precisar recarregar a página | ⏳ |
| C2 | Como **profissional**, cadastrar o evento "São João", com data `2026-06-24` e local "Parque do Povo" | Aparece na lista | ⏳ |
| C3 | Como **turista**, tentar cadastrar | O botão não aparece, ou aparece o erro "Usuário não possui permissão" | ⏳ |
| C4 | Conferir no MongoDB Atlas | O registro está salvo no banco | ⏳ |

### 3.4 UPDATE — edição

| # | O que fazer | Resultado esperado | Status |
|---|-------------|--------------------|--------|
| U1 | Como profissional, clicar em **Editar** no "Açude Velho" | O formulário abre já preenchido | ⏳ |
| U2 | Mudar o nome para "Açude Velho - Centro" e salvar | A lista mostra o nome novo | ⏳ |
| U3 | Clicar em Editar e depois em **Cancelar** | O formulário fecha e os campos ficam limpos | ⏳ |
| U4 | Como turista, tentar editar | O botão não aparece, ou aparece o erro "Usuário não possui permissão" | ⏳ |

### 3.5 DELETE — exclusão

| # | O que fazer | Resultado esperado | Status |
|---|-------------|--------------------|--------|
| D1 | Como profissional, clicar em **Excluir** e depois em Cancelar na confirmação | Nada é apagado | ⏳ |
| D2 | Clicar em Excluir e confirmar | O item some da lista | ⏳ |
| D3 | Conferir no MongoDB Atlas | O registro não existe mais | ⏳ |
| D4 | Como turista, tentar excluir pelo Postman com o token dele | Erro 403 "Usuário não possui permissão" | ⏳ |

---

## 4. Conferência final da integração

- [ ] Todas as branches do frontend entraram na `main` por Pull Request
- [ ] Na `main` atualizada, `npm run dev` funciona no backend e no frontend
- [ ] Todos os testes da seção 3 estão ✅
