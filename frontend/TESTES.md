# Testes — SafeTour

Fluxo testado: **React → Apollo Client → GraphQL → backend → MongoDB**

Legenda: ✅ passou · ❌ falhou · ⏳ não testado

**Rodada de testes mais recente:** 06/10/2026 (automatizada: backend real + MongoDB local em um banco descartável `safetour_teste`, frontend real e Edge em modo headless; nenhum dado do Atlas foi tocado).

---

## 1. Operações GraphQL usadas pelo frontend

Nomes e argumentos conferidos com `src/graphql/schema.js`. As consultas (`pontosTuristicos`, `eventos`, `estabelecimentos`, `areasDeRisco`) são **públicas**; as demais exigem o perfil indicado no [README da raiz](../README.md).

```graphql
mutation Login($input: LoginInput!)             { login(input: $input) { token usuario { id nome email perfil } } }
mutation LoginProfissional($input: LoginInput!) { loginProfissional(input: $input) { token usuario { id nome email perfil } } }
mutation Cadastrar($input: CadastroInput!)      { cadastrar(input: $input) { usuario { id perfil } } }
query    { perfil { id nome email perfil } }
query    { pontosTuristicos { id nome descricao categoria endereco nivelRisco } }
query    { eventos { id nome descricao data local nivelRisco } }
query    { estabelecimentos { id nome descricao categoria endereco cidade latitude longitude } }
query    { meuEstabelecimento { id nome cidade } }
mutation CadastrarEstabelecimento($input: EstabelecimentoInput!)
mutation AtualizarEstabelecimento($id: ID!, $input: AtualizarEstabelecimentoInput!)
mutation ExcluirEstabelecimento($id: ID!)
# + cadastrar/atualizar/excluir PontoTuristico e Evento, definirNivelRisco*
```

As exclusões devolvem `{ mensagem }`, então a mutation precisa pedir o campo `mensagem`.

---

## 2. Como repetir os testes manualmente

1. Backend: `npm run dev` na raiz. Frontend: `cd frontend` → `npm run dev` → `http://localhost:5173`.
2. Crie uma conta **profissional** (não há cadastro público): `npm run criar-profissional -- "Nome" email@exemplo.com` (senha em `PROFISSIONAL_SENHA`).
3. Crie um turista e uma instituição pelo `/cadastro`.
4. Use registros com "TESTE" no nome e apague só os que você criou.

---

## 3. Roteiro e resultados

### 3.1 Turista

| # | Verificação | Status |
|---|-------------|--------|
| T1 | Cadastro em `/cadastro` leva para `/` com nome e perfil na Navbar | ✅ |
| T2 | Cadastro oferece só Turista e Instituição | ✅ |
| T3 | Sessão persiste após recarregar a página (sem piscar login) | ✅ |
| T4 | `/login` e `/cadastro` logado redirecionam para `/` | ✅ |
| T5 | Home, busca, pontos, eventos e estabelecimentos abrem sem login e mostram dados reais | ✅ |
| T6 | `/profissional` e `/meu-estabelecimento` mostram "Acesso não permitido" | ✅ |
| T7 | Sem botões de cadastrar/editar/excluir nem seletor de risco | ✅ |
| T8 | Entrar pelo Acesso profissional é recusado | ✅ |
| T9 | Sair e entrar de novo | ✅ |

### 3.2 Instituição

| # | Verificação | Status |
|---|-------------|--------|
| I1 | Cadastro leva a `/meu-estabelecimento` com formulário de criação | ✅ |
| I2 | "Usar minha localização" preenche latitude/longitude | ✅ |
| I3 | Geolocalização negada: mensagem amigável, formulário continua utilizável | ✅ |
| I4 | Salvar (endereço, cidade, latitude/longitude manuais) e ver a prévia | ✅ |
| I5 | Sair, entrar de novo e os dados persistem; o formulário passa a ser de edição | ✅ |
| I6 | Editar o próprio estabelecimento; latitude inválida é recusada | ✅ |
| I7 | Aparece em `/estabelecimentos` (filtro por cidade, link "Ver no mapa") | ✅ |
| I8 | Segundo estabelecimento da mesma conta é recusado (API, inclusive requisições simultâneas) | ✅ |
| I9 | Editar estabelecimento de outra instituição é recusado (API) | ✅ |
| I10 | `/profissional` mostra "Acesso não permitido"; Acesso profissional recusa a conta | ✅ |

### 3.3 Profissional

| # | Verificação | Status |
|---|-------------|--------|
| P1 | Entra pelo `/acesso-profissional` e vai a `/profissional` | ✅ |
| P2 | Painel com abas (Resumo, Pontos, Eventos, Estabelecimentos, Níveis de risco); aba na URL sobrevive ao F5 | ✅ |
| P3 | Criar, editar e excluir ponto turístico (de teste) | ✅ |
| P4 | Criar, editar e excluir evento (de teste) | ✅ |
| P5 | Editar estabelecimento de qualquer instituição | ✅ |
| P6 | Alterar nível de risco de ponto e de evento | ✅ |
| P7 | Páginas públicas mostram os controles de administração só para ele | ✅ |

### 3.4 Segurança (API)

| # | Verificação | Status |
|---|-------------|--------|
| S1 | Cadastro público com `perfil: "profissional"` ou `"admin"` é recusado e nada é criado | ✅ |
| S2 | Senha guardada com bcrypt | ✅ |
| S3 | Turista e instituição não executam mutations profissionais (pontos, eventos, risco, excluir estabelecimento) | ✅ |
| S4 | Visitante sem token não executa mutations | ✅ |
| S5 | `criadoPor` enviado no input é rejeitado; o dono sai do usuário autenticado | ✅ |
| S6 | E-mail do autor não é exposto nas consultas públicas | ✅ |
| S7 | Excluir conta não apaga pontos/eventos; profissional não se auto-exclui; token de conta excluída deixa de valer | ✅ |

### 3.5 Busca, rotas e responsividade

| # | Verificação | Status |
|---|-------------|--------|
| B1 | `/busca?q=parque`, `?q=Campina Grande`, `?q=restaurante&tipo=estabelecimentos`, `?q=festa&tipo=eventos` | ✅ |
| B2 | Busca sem resultado mostra mensagem; busca pela barra da Home navega para `/busca?q=...` | ✅ |
| B3 | Abrir diretamente (F5) cada rota pública e protegida funciona | ✅ |
| B4 | URL inexistente mostra a página 404 com botão para a Home | ✅ |
| B5 | Largura de 390 px: sem rolagem horizontal, menu hambúrguer abre e fecha | ✅ |
| B6 | Sem erros de console nos fluxos acima | ✅ |

---

## 4. Build

`cd frontend && npm run build` — ✅ sem erros (aviso apenas sobre o tamanho do bundle).
