import { gql } from "@apollo/client";

// Nomes e argumentos conferidos com src/graphql/schema.js do backend.
// Diferente do roteiro (criarPessoa(nome, email, idade)), o backend
// recebe os dados dentro de um objeto "input".

// ---------- Login ----------

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      mensagem
      token
      usuario {
        id
        nome
        email
        perfil
      }
    }
  }
`;

// ---------- Pontos Turísticos ----------

export const CREATE_PONTO_TURISTICO = gql`
  mutation CadastrarPontoTuristico($input: PontoTuristicoInput!) {
    cadastrarPontoTuristico(input: $input) {
      id
      nome
      descricao
      categoria
      endereco
    }
  }
`;

export const UPDATE_PONTO_TURISTICO = gql`
  mutation AtualizarPontoTuristico($id: ID!, $input: AtualizarPontoTuristicoInput!) {
    atualizarPontoTuristico(id: $id, input: $input) {
      id
      nome
      descricao
      categoria
      endereco
    }
  }
`;

export const DELETE_PONTO_TURISTICO = gql`
  mutation ExcluirPontoTuristico($id: ID!) {
    excluirPontoTuristico(id: $id) {
      mensagem
    }
  }
`;

// ---------- Eventos ----------

export const CREATE_EVENTO = gql`
  mutation CadastrarEvento($input: EventoInput!) {
    cadastrarEvento(input: $input) {
      id
      nome
      descricao
      data
      local
    }
  }
`;

export const UPDATE_EVENTO = gql`
  mutation AtualizarEvento($id: ID!, $input: AtualizarEventoInput!) {
    atualizarEvento(id: $id, input: $input) {
      id
      nome
      descricao
      data
      local
    }
  }
`;

export const DELETE_EVENTO = gql`
  mutation ExcluirEvento($id: ID!) {
    excluirEvento(id: $id) {
      mensagem
    }
  }
`;
