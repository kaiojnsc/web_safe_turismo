import { gql } from "@apollo/client";

// Nomes e campos conferidos com src/graphql/schema.js do backend.

export const GET_PONTOS_TURISTICOS = gql`
  query GetPontosTuristicos {
    pontosTuristicos {
      id
      nome
      descricao
      categoria
      endereco
    }
  }
`;

export const GET_EVENTOS = gql`
  query GetEventos {
    eventos {
      id
      nome
      descricao
      data
      local
    }
  }
`;
