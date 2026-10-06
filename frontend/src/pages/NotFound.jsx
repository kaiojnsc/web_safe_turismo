import { Link } from "react-router-dom";

import Icon from "../components/Icon";

// Qualquer endereço que não exista no SafeTour cai aqui (nunca tela branca).
function NotFound() {
  return (
    <main className="page page-estreita">
      <div className="empty nao-encontrada">
        <span className="nao-encontrada-icone">
          <Icon nome="pin" tamanho={34} />
        </span>
        <h1>Página não encontrada</h1>
        <p>O endereço que você abriu não existe ou foi movido.</p>
        <div className="form-buttons" style={{ justifyContent: "center" }}>
          <Link to="/" className="button save grande">
            Voltar para a Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
