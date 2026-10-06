import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { ROTULOS_PERFIL, useAuth } from "../context/AuthContext";
import Icon from "./Icon";
import "./Navbar.css";

function Navbar() {
  const { usuario, ehInstituicao, ehProfissional, sair } = useAuth();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  const fecharMenu = () => setMenuAberto(false);

  const handleSair = async () => {
    await sair();
    fecharMenu();
    navigate("/");
  };

  const linkClass = ({ isActive }) => `navbar-link ${isActive ? "active" : ""}`;

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={fecharMenu} aria-label="SafeTour - início">
          <span className="navbar-logo-icone">
            <Icon nome="escudo" tamanho={20} />
          </span>
          SafeTour
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
        >
          <Icon nome={menuAberto ? "fechar" : "menu"} tamanho={24} />
        </button>

        <nav className={`navbar-menu ${menuAberto ? "active" : ""}`} aria-label="Principal">
          <ul className="navbar-links">
            <li>
              <NavLink to="/" end className={linkClass} onClick={fecharMenu}>
                Início
              </NavLink>
            </li>
            <li>
              <NavLink to="/pontos-turisticos" className={linkClass} onClick={fecharMenu}>
                Pontos turísticos
              </NavLink>
            </li>
            <li>
              <NavLink to="/eventos" className={linkClass} onClick={fecharMenu}>
                Eventos
              </NavLink>
            </li>
            <li>
              <NavLink to="/estabelecimentos" className={linkClass} onClick={fecharMenu}>
                Estabelecimentos
              </NavLink>
            </li>

            {ehInstituicao && (
              <li>
                <NavLink to="/meu-estabelecimento" className={linkClass} onClick={fecharMenu}>
                  Meu estabelecimento
                </NavLink>
              </li>
            )}

            {ehProfissional && (
              <li>
                <NavLink to="/profissional" className={linkClass} onClick={fecharMenu}>
                  Painel profissional
                </NavLink>
              </li>
            )}
          </ul>

          {usuario ? (
            <div className="navbar-usuario">
              <div className="navbar-user-info">
                <span className="navbar-user-name">{usuario.nome}</span>
                <span className={`navbar-user-role perfil-${usuario.perfil}`}>
                  {ROTULOS_PERFIL[usuario.perfil] || usuario.perfil}
                </span>
              </div>

              <button type="button" className="button ghost pequeno" onClick={handleSair}>
                Sair
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/cadastro" className="navbar-criar" onClick={fecharMenu}>
                Criar conta
              </Link>
              <Link to="/login" className="button" onClick={fecharMenu}>
                Entrar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;