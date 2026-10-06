import { gql } from "@apollo/client";

// Nomes e campos conferidos com src/graphql/schema.js do backend.

// Usado para confirmar no servidor, ao abrir o site, que a sessão salva ainda vale.
export const GET_PERFIL = gql`
  query GetPerfil {
    perfil {
      id
      nome
      email
      perfil
    }
  }
`;

export const GET_PONTOS_TURISTICOS = gql`
  query GetPontosTuristicos {
    pontosTuristicos {
      id
      nome
      descricao
      categoria
      endereco
      nivelRisco
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
      nivelRisco
    }
  }
`;

const CAMPOS_ESTABELECIMENTO = `
  id
  nome
  descricao
  categoria
  endereco
  cidade
  latitude
  longitude
  criadoPor {
    id
  }
`;

export const GET_ESTABELECIMENTOS = gql`
  query GetEstabelecimentos {
    estabelecimentos {
      ${CAMPOS_ESTABELECIMENTO}
    }
  }
`;

export const GET_MEU_ESTABELECIMENTO = gql`
  query GetMeuEstabelecimento {
    meuEstabelecimento {
      ${CAMPOS_ESTABELECIMENTO}
    }
  }
`;

// Tudo de uma vez: usado na Home, na Busca e no painel profissional.
export const GET_DESCOBERTA = gql`
  query GetDescoberta {
    pontosTuristicos {
      id
      nome
      descricao
      categoria
      endereco
      nivelRisco
    }
    eventos {
      id
      nome
      descricao
      data
      local
      nivelRisco
    }
    estabelecimentos {
      ${CAMPOS_ESTABELECIMENTO}
    }
  }
`;

export const GET_AREAS_RISCO = gql`
  query GetAreasRisco {
    areasDeRisco {
      id
      cidade
      regiao
      nivel
      descricao
    }
  }
`;
