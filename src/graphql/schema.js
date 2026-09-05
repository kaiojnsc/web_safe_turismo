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

  type PontoTuristico {
    id: ID!
    nome: String!
    descricao: String!
    categoria: String
    endereco: String
    latitude: Float
    longitude: Float
    criadoPor: Usuario
    createdAt: String
    updatedAt: String
  }

  type Evento {
    id: ID!
    nome: String!
    descricao: String!
    data: String!
    local: String!
    criadoPor: Usuario
    createdAt: String
    updatedAt: String
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

  type Query {
    perfil: Usuario
    pontosTuristicos: [PontoTuristico!]!
    pontoTuristico(id: ID!): PontoTuristico
    eventos: [Evento!]!
    evento(id: ID!): Evento
  }

  type Mutation {
    cadastrar(input: CadastroInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    atualizarPerfil(input: AtualizarPerfilInput!): AuthPayload!
    excluirPerfil: MensagemPayload!

    cadastrarPontoTuristico(input: PontoTuristicoInput!): PontoTuristico!
    atualizarPontoTuristico(id: ID!, input: AtualizarPontoTuristicoInput!): PontoTuristico!
    excluirPontoTuristico(id: ID!): MensagemPayload!

    cadastrarEvento(input: EventoInput!): Evento!
    atualizarEvento(id: ID!, input: AtualizarEventoInput!): Evento!
    excluirEvento(id: ID!): MensagemPayload!
  }
`);

module.exports = schema;
