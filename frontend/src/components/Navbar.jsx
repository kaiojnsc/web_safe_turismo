import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  const handleSair = async () => {
    await sair();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          🌍 SafeTour
        </Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/" className="navbar-link">
            Início
          </Link>
        </li>
        <li>
          <Link to="/pontos-turisticos" className="navbar-link">
            Pontos Turísticos
          </Link>
        </li>
        <li>
          <Link to="/eventos" className="navbar-link">
            Eventos
          </Link>
        </li>
        {usuario ? (
          <li className="navbar-usuario">
            <span>
              {usuario.nome} ({usuario.perfil})
            </span>
            <button type="button" className="navbar-sair" onClick={handleSair}>
              Sair
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login" className="navbar-link">
              Entrar
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
