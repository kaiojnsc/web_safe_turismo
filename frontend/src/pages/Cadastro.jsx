import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";

import { CADASTRAR, LOGIN } from "../graphql/mutations";
import { useAuth } from "../context/AuthContext";
import { IMG_HERO } from "../utils/helpers";
import ErrorMessage from "../components/ErrorMessage";
import Icon from "../components/Icon";
import "./Auth.css";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Só existem duas opções públicas. "Profissional" não aparece aqui
// e o backend também recusa esse perfil no cadastro.
const TIPOS_CONTA = [
  {
    valor: "turista",
    titulo: "Turista",
    texto: "Quero descobrir lugares, eventos e estabelecimentos.",
    icone: "camera",
  },
  {
    valor: "instituicao",
    titulo: "Instituição",
    texto: "Tenho um estabelecimento e quero divulgá-lo.",
    icone: "loja",
  },
];

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [perfil, setPerfil] = useState("turista");
  const [erros, setErros] = useState({});
  const [erro, setErro] = useState("");

  const [cadastrar, { loading: cadastrando }] = useMutation(CADASTRAR);
  const [login, { loading: entrando }] = useMutation(LOGIN);
  const { usuario, rotaInicial, entrar } = useAuth();
  const navigate = useNavigate();

  // Já está logado: leva para a área do seu perfil.
  if (usuario) {
    return <Navigate to={rotaInicial} replace />;
  }

  const validar = () => {
    const novos = {};

    if (nome.trim().length < 2) {
      novos.nome = "Informe seu nome.";
    }

    if (!REGEX_EMAIL.test(email.trim())) {
      novos.email = "Informe um e-mail válido.";
    }

    if (senha.length < 6) {
      novos.senha = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (confirmar !== senha) {
      novos.confirmar = "As senhas não coincidem.";
    }

    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro("");

    if (!validar()) {
      return;
    }

    try {
      await cadastrar({
        variables: { input: { nome: nome.trim(), email: email.trim(), senha, perfil } },
      });

      // Conta criada: já entra automaticamente
      const { data } = await login({
        variables: { input: { email: email.trim(), senha } },
      });

      entrar(data.login.token, data.login.usuario);
      navigate(perfil === "instituicao" ? "/meu-estabelecimento" : "/", { replace: true });
    } catch (error) {
      setErro(error.message);
    }
  };

  const ocupado = cadastrando || entrando;

  return (
    <main className="auth">
      <div className="auth-imagem" style={{ backgroundImage: `url(${IMG_HERO})` }}>
        <div className="auth-imagem-texto">
          <h2>Faça parte do SafeTour</h2>
          <p>Descubra destinos com segurança ou divulgue o seu estabelecimento para quem viaja.</p>
        </div>
      </div>

      <div className="auth-painel">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h1>Criar conta</h1>
          <p className="auth-sub">É rápido e gratuito.</p>

          <ErrorMessage message={erro} />

          <fieldset className="tipos-conta">
            <legend>Tipo de conta</legend>
            {TIPOS_CONTA.map((tipo) => (
              <label
                key={tipo.valor}
                className={`tipo-conta ${perfil === tipo.valor ? "ativo" : ""}`}
              >
                <input
                  type="radio"
                  name="perfil"
                  value={tipo.valor}
                  checked={perfil === tipo.valor}
                  onChange={() => setPerfil(tipo.valor)}
                />
                <Icon nome={tipo.icone} tamanho={22} />
                <span>
                  <strong>{tipo.titulo}</strong>
                  <small>{tipo.texto}</small>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="form-group">
            <label htmlFor="nome">
              {perfil === "instituicao" ? "Nome da instituição" : "Nome"}
            </label>
            <input
              id="nome"
              type="text"
              autoComplete="name"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
            {erros.nome && <p className="erro-campo">{erros.nome}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {erros.email && <p className="erro-campo">{erros.email}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                autoComplete="new-password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
              />
              {erros.senha && <p className="erro-campo">{erros.senha}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmar">Confirmar senha</label>
              <input
                id="confirmar"
                type="password"
                autoComplete="new-password"
                value={confirmar}
                onChange={(event) => setConfirmar(event.target.value)}
              />
              {erros.confirmar && <p className="erro-campo">{erros.confirmar}</p>}
            </div>
          </div>

          <button type="submit" className="button save grande auth-botao" disabled={ocupado}>
            {ocupado ? "Criando conta..." : "Criar conta"}
          </button>

          <p className="auth-links">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default Cadastro;
