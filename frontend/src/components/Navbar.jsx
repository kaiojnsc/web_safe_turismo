import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
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
      </ul>
    </nav>
  );
}

export default Navbar;
