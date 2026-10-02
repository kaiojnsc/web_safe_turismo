import { createContext, useContext, useState } from "react";
import { useApolloClient } from "@apollo/client/react";

import { limparSessao, obterUsuario, salvarSessao } from "../services/auth";

// Deixa o usuário logado disponível em qualquer componente
// (Navbar, páginas etc.) através do hook useAuth().
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const client = useApolloClient();
  const [usuario, setUsuario] = useState(obterUsuario());

  const entrar = (token, dadosUsuario) => {
    salvarSessao(token, dadosUsuario);
    setUsuario(dadosUsuario);
  };

  const sair = async () => {
    limparSessao();
    setUsuario(null);
    // Limpa os dados que o Apollo guardou do usuário anterior
    await client.clearStore();
  };

  const ehProfissional = usuario?.perfil === "profissional";

  return (
    <AuthContext.Provider value={{ usuario, ehProfissional, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
