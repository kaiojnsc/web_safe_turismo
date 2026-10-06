const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Usuario {
    id: ID!
    nome: String!
    email: String!
    perfil: String!
    createdAt: String
    updatedAt: String
  }

  # Dados públicos de quem cadastrou um registro (nunca inclui e-mail)
  type Autor {
    id: ID!
    nome: String!
    perfil: String!
  }

  type PontoTuristico {
    id: ID!
    nome: String!
    descricao: String!
    categoria: String
    endereco: String
    latitude: Float
    longitude: Float
    nivelRisco: String!
    criadoPor: Autor
    createdAt: String
    updatedAt: String
  }

  type Evento {
    id: ID!
    nome: String!
    descricao: String!
    data: String!
    local: String!
    nivelRisco: String!
    criadoPor: Autor
    createdAt: String
    updatedAt: String
  }

  type Estabelecimento {
    id: ID!
    nome: String!
    descricao: String!
    categoria: String!
    endereco: String
    cidade: String!
    latitude: Float
    longitude: Float
    criadoPor: Autor
    createdAt: String
    updatedAt: String
  }

  type AreaDeRisco {
    id: ID!
    cidade: String!
    regiao: String
    nivel: String!
    descricao: String!
    latitude: Float
    longitude: Float
  }

  type MensagemPayload {
    mensagem: String!
  }

  type AuthPayload {
    mensagem: String!
    token: String
    usuario: Usuario
  }

  input CadastroInput {
    nome: String!
    email: String!
    senha: String!
    perfil: String
  }

  input LoginInput {
    email: String!
    senha: String!
  }

  input AtualizarPerfilInput {
    nome: String
    email: String
    senha: String
  }

  input PontoTuristicoInput {
    nome: String!
    descricao: String!
    categoria: String
    endereco: String
    latitude: Float
    longitude: Float
  }

  input AtualizarPontoTuristicoInput {
    nome: String
    descricao: String
    categoria: String
    endereco: String
    latitude: Float
    longitude: Float
  }

  input EventoInput {
    nome: String!
    descricao: String!
    data: String!
    local: String!
  }

  input AtualizarEventoInput {
    nome: String
    descricao: String
    data: String
    local: String
  }

  input EstabelecimentoInput {
    nome: String!
    descricao: String!
    categoria: String!
    endereco: String
    cidade: String!
    latitude: Float
    longitude: Float
  }

  input AtualizarEstabelecimentoInput {
    nome: String
    descricao: String
    categoria: String
    endereco: String
    cidade: String
    latitude: Float
    longitude: Float
  }

  type Query {
    perfil: Usuario
    pontosTuristicos: [PontoTuristico!]!
    pontoTuristico(id: ID!): PontoTuristico
    eventos: [Evento!]!
    evento(id: ID!): Evento
    estabelecimentos(cidade: String, categoria: String): [Estabelecimento!]!
    estabelecimento(id: ID!): Estabelecimento
    meuEstabelecimento: Estabelecimento
    areasDeRisco(cidade: String): [AreaDeRisco!]!
  }

  type Mutation {
    cadastrar(input: CadastroInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    loginProfissional(input: LoginInput!): AuthPayload!
    atualizarPerfil(input: AtualizarPerfilInput!): AuthPayload!
    excluirPerfil: MensagemPayload!

    cadastrarPontoTuristico(input: PontoTuristicoInput!): PontoTuristico!
    atualizarPontoTuristico(id: ID!, input: AtualizarPontoTuristicoInput!): PontoTuristico!
    excluirPontoTuristico(id: ID!): MensagemPayload!
    definirNivelRiscoPontoTuristico(id: ID!, nivelRisco: String!): PontoTuristico!

    cadastrarEvento(input: EventoInput!): Evento!
    atualizarEvento(id: ID!, input: AtualizarEventoInput!): Evento!
    excluirEvento(id: ID!): MensagemPayload!
    definirNivelRiscoEvento(id: ID!, nivelRisco: String!): Evento!

    cadastrarEstabelecimento(input: EstabelecimentoInput!): Estabelecimento!
    atualizarEstabelecimento(id: ID!, input: AtualizarEstabelecimentoInput!): Estabelecimento!
    excluirEstabelecimento(id: ID!): MensagemPayload!
  }
`);

module.exports = schema;
