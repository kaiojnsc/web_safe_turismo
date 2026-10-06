import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

import { obterToken } from "./auth";

// Endereço do GraphQL do backend (definido no arquivo .env)
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
});

// Consultas de pontos, eventos e estabelecimentos são públicas; cadastrar/editar/excluir
// exige login com o perfil certo. Este link coloca o token JWT (quando existe)
// em todas as requisições:
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
  // Mostra o que já está em cache e confirma com o servidor, para as listas
  // refletirem cadastros feitos em outras telas ou por outras pessoas.
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network" },
  },
});

export default client;
