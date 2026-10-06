import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

// Protege uma página por perfil. Isto é só experiência de uso:
// quem realmente bloqueia o acesso aos dados é o backend.
// "entrada" define para onde mandar quem ainda não entrou.
function RotaProtegida({ perfis, entrada = "/login", children }) {
  const { usuario, carregando, rotaInicial } = useAuth();
  const local = useLocation();

  // Ainda confirmando a sessão salva: não decide nada antes disso.
  if (carregando) {
    return <Loading />;
  }

  if (!usuario) {
    return (
      <div className="page page-estreita">
        <div className="empty">
          <strong>Entre para continuar</strong>
          Você precisa estar logado para acessar esta página.
          <div className="form-buttons" style={{ justifyContent: "center" }}>
            <Link to={entrada} state={{ de: local.pathname }} className="button save">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!perfis.includes(usuario.perfil)) {
    return (
      <div className="page page-estreita">
        <div className="empty" role="alert">
          <strong>Acesso não permitido</strong>
          Seu tipo de conta não tem acesso a esta página.
          <div className="form-buttons" style={{ justifyContent: "center" }}>
            <Link to={rotaInicial} className="button save">
              Ir para minha área
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default RotaProtegida;
