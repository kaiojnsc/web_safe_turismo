import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

import { obterToken } from "./auth";

// Endereço do GraphQL do backend (definido no arquivo .env)
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
});

// O backend exige login para listar e para cadastrar/editar/excluir.
// Este link coloca o token JWT em todas as requisições:
//   Authorization: Bearer <token>
const authLink = new SetContextLink((prevContext) => {
  const token = obterToken();

  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
