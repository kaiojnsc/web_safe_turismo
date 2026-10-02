import { Link } from "react-router-dom";

// Aparece quando alguém tenta abrir uma página que exige login.
function LoginNecessario({ titulo }) {
  return (
    <div className="page">
      <h1>{titulo}</h1>
      <p className="empty">
        Você precisa <Link to="/login">entrar</Link> para ver esta página.
      </p>
    </div>
  );
}

export default LoginNecessario;
