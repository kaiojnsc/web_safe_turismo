import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";

import { LOGIN, LOGIN_PROFISSIONAL } from "../graphql/mutations";
import { useAuth } from "../context/AuthContext";
import { IMG_HERO } from "../utils/helpers";
import ErrorMessage from "../components/ErrorMessage";
import Icon from "../components/Icon";
import "./Auth.css";

// Uma tela para dois modos:
//   /login               -> turista e instituição (destaque)
//   /acesso-profissional -> administrador do SafeTour (discreto)
// A checagem real do perfil é feita no backend (loginProfissional).
function Login({ profissional = false }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const [login, { loading }] = useMutation(profissional ? LOGIN_PROFISSIONAL : LOGIN);
  const { usuario, rotaInicial, entrar } = useAuth();
  const navigate = useNavigate();
  const local = useLocation();

  // Já está logado: não faz sentido mostrar o login de novo.
  if (usuario) {
    return <Navigate to={local.state?.de || rotaInicial} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro("");

    try {
      const { data } = await login({
        variables: { input: { email: email.trim(), senha } },
      });

      const resultado = profissional ? data.loginProfissional : data.login;
      const { token, usuario } = resultado;

      entrar(token, usuario);

      const destinoPadrao =
        usuario.perfil === "profissional"
          ? "/profissional"
          : usuario.perfil === "instituicao"
            ? "/meu-estabelecimento"
            : "/";

      navigate(local.state?.de || destinoPadrao, { replace: true });
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <main className={`auth ${profissional ? "auth-profissional" : ""}`}>
      <div className="auth-imagem" style={{ backgroundImage: `url(${IMG_HERO})` }}>
        <div className="auth-imagem-texto">
          <h2>{profissional ? "Gestão do SafeTour" : "Viaje com mais segurança"}</h2>
          <p>
            {profissional
              ? "Área restrita para profissionais que administram destinos, eventos e níveis de risco."
              : "Entre para explorar destinos, eventos e estabelecimentos."}
          </p>
        </div>
      </div>

      <div className="auth-painel">
        <form className="auth-form" onSubmit={handleSubmit}>
          {profissional && (
            <span className="auth-selo">
              <Icon nome="escudo" tamanho={16} /> Acesso profissional
            </span>
          )}

          <h1>{profissional ? "Entrar como profissional" : "Entrar no SafeTour"}</h1>
          <p className="auth-sub">
            {profissional
              ? "Use as credenciais da sua conta profissional."
              : "Que bom ter você de volta."}
          </p>

          <ErrorMessage message={erro} />

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="button save grande auth-botao" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {profissional ? (
            <p className="auth-links">
              <Link to="/login">← Voltar ao login comum</Link>
            </p>
          ) : (
            <>
              <p className="auth-links">
                Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
              </p>
              <p className="auth-discreto">
                <Link to="/acesso-profissional">Acesso profissional</Link>
              </p>
            </>
          )}
        </form>
      </div>
    </main>
  );
}

export default Login;
