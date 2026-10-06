import { createContext, useContext, useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client/react";

import { GET_PERFIL } from "../graphql/queries";
import {
  expiracaoToken,
  limparSessao,
  obterToken,
  obterUsuario,
  salvarSessao,
} from "../services/auth";

// Deixa o usuário logado disponível em qualquer componente
// (Navbar, páginas etc.) através do hook useAuth().
// Perfis: "turista" | "instituicao" | "profissional" (administrador).
const AuthContext = createContext(null);

export const ROTULOS_PERFIL = {
  turista: "Turista",
  instituicao: "Instituição",
  profissional: "Profissional",
};

// Só encerra a sessão quando o servidor diz que ela não vale mais.
// Falha de rede não deve deslogar ninguém.
const ehErroDeAutenticacao = (erro) =>
  (erro?.errors || []).some((e) => e?.extensions?.code === "UNAUTHENTICATED");

export function AuthProvider({ children }) {
  const client = useApolloClient();
  const [usuario, setUsuario] = useState(obterUsuario());
  // Enquanto confirma a sessão salva no servidor, as rotas protegidas esperam
  // (evita piscar "faça login" para quem já estava logado).
  const [carregando, setCarregando] = useState(() => Boolean(obterUsuario()));

  // Ao abrir o site: confirma a sessão salva e atualiza nome/perfil vindos do servidor.
  useEffect(() => {
    let ativo = true;
    const token = obterToken();

    if (!token) {
      setCarregando(false);
      return undefined;
    }

    client
      .query({ query: GET_PERFIL, fetchPolicy: "network-only" })
      .then(({ data }) => {
        if (ativo && data?.perfil) {
          const atualizado = { ...data.perfil };
          salvarSessao(token, atualizado);
          setUsuario(atualizado);
        }
      })
      .catch((erro) => {
        if (ativo && ehErroDeAutenticacao(erro)) {
          limparSessao();
          setUsuario(null);
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [client]);

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

  // Encerra a sessão sozinha quando o token vence.
  useEffect(() => {
    if (!usuario) {
      return undefined;
    }

    const expiraEm = expiracaoToken();

    if (!expiraEm) {
      return undefined;
    }

    const espera = Math.min(Math.max(expiraEm - Date.now(), 0), 2147483647);
    const temporizador = setTimeout(() => {
      limparSessao();
      setUsuario(null);
      client.clearStore();
    }, espera);

    return () => clearTimeout(temporizador);
  }, [usuario, client]);

  const perfil = usuario?.perfil;
  const ehProfissional = perfil === "profissional";
  const ehInstituicao = perfil === "instituicao";
  const ehTurista = perfil === "turista";

  // Página inicial adequada para cada perfil depois do login.
  const rotaInicial = ehProfissional
    ? "/profissional"
    : ehInstituicao
      ? "/meu-estabelecimento"
      : "/";

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        ehProfissional,
        ehInstituicao,
        ehTurista,
        rotaInicial,
        entrar,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
