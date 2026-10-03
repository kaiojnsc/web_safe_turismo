import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  const handleSair = async () => {
    await sair();
    setMenuAberto(false);
    navigate('/');
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  const linkClass = ({ isActive }) =>
    `navbar-link ${isActive ? 'active' : ''}`;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo" onClick={fecharMenu}>
            SafeTour
          </Link>
        </div>

        <button
          type="button"
          className={`navbar-toggle ${menuAberto ? 'active' : ''}`}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Abrir menu"
          aria-expanded={menuAberto}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${menuAberto ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li>
              <NavLink
                to="/"
                end
                className={linkClass}
                onClick={fecharMenu}
              >
                Início
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/pontos-turisticos"
                className={linkClass}
                onClick={fecharMenu}
              >
                Pontos Turísticos
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/eventos"
                className={linkClass}
                onClick={fecharMenu}
              >
                Eventos
              </NavLink>
            </li>
          </ul>

          {usuario ? (
            <div className="navbar-usuario">
              <div className="navbar-user-info">
                <span className="navbar-user-name">
                  {usuario.nome}
                </span>

                <span className="navbar-user-role">
                  {usuario.perfil}
                </span>
              </div>

              <button
                type="button"
                className="navbar-sair"
                onClick={handleSair}
              >
                Sair
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="navbar-login"
              onClick={fecharMenu}
            >
              Entrar
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;