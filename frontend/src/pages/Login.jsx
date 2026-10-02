import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";

import { LOGIN } from "../graphql/mutations";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const [login, { loading }] = useMutation(LOGIN);
  const { entrar } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro("");

    try {
      const { data } = await login({
        variables: { input: { email, senha } },
      });

      entrar(data.login.token, data.login.usuario);
      navigate("/pontos-turisticos");
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="page page-estreita">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Entrar no SafeTour</h2>

        <ErrorMessage message={erro} />

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
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
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="button save" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
