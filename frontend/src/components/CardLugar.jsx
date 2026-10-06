import { Link } from "react-router-dom";

import Icon from "./Icon";

// Card visual reutilizado em Pontos, Eventos, Estabelecimentos, Home e Busca.
// "children" recebe as ações (ex.: botões do profissional).
function CardLugar({ imagem, selo, risco, titulo, local, meta, descricao, to, children }) {
  const titulo_ = to ? (
    <Link to={to} className="card-titulo-link">
      {titulo}
    </Link>
  ) : (
    titulo
  );

  return (
    <article className="card-lugar">
      <div className="card-imagem">
        <img src={imagem} alt="" loading="lazy" />
        {selo && <span className="card-selo">{selo}</span>}
        {risco && <span className="card-risco">{risco}</span>}
      </div>

      <div className="card-corpo">
        <h3>{titulo_}</h3>

        {local && (
          <p className="card-meta">
            <Icon nome="pin" tamanho={15} />
            {local}
          </p>
        )}

        {meta && <p className="card-meta">{meta}</p>}

        {descricao && <p className="card-descricao">{descricao}</p>}

        {children && <div className="card-acoes">{children}</div>}
      </div>
    </article>
  );
}

export default CardLugar;
