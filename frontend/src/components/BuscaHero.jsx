import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Icon from "./Icon";

export const TIPOS_BUSCA = [
  { valor: "tudo", rotulo: "Pesquisar tudo", icone: "casa" },
  { valor: "pontos", rotulo: "Pontos turísticos", icone: "camera" },
  { valor: "eventos", rotulo: "Eventos", icone: "calendario" },
  { valor: "estabelecimentos", rotulo: "Estabelecimentos", icone: "loja" },
];

// Abas + barra de pesquisa grande. Ao buscar, leva para /busca?q=...&tipo=...
// onde os resultados reais são filtrados.
function BuscaHero({ qInicial = "", tipoInicial = "tudo", aoBuscar }) {
  const navigate = useNavigate();
  const [termo, setTermo] = useState(qInicial);
  const [tipo, setTipo] = useState(tipoInicial);

  const buscar = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (termo.trim()) {
      params.set("q", termo.trim());
    }

    if (tipo !== "tudo") {
      params.set("tipo", tipo);
    }

    if (aoBuscar) {
      aoBuscar(termo.trim(), tipo);
    }

    navigate(`/busca${params.toString() ? `?${params}` : ""}`);
  };

  const placeholder =
    tipo === "pontos"
      ? "Pesquise pontos turísticos..."
      : tipo === "eventos"
        ? "Pesquise eventos..."
        : tipo === "estabelecimentos"
          ? "Pesquise restaurantes, hospedagens..."
          : "Pesquise lugares, eventos e estabelecimentos...";

  return (
    <div className="busca-hero">
      <div className="busca-abas" role="tablist" aria-label="Tipo de busca">
        {TIPOS_BUSCA.map((item) => (
          <button
            key={item.valor}
            type="button"
            role="tab"
            aria-selected={tipo === item.valor}
            className={`busca-aba ${tipo === item.valor ? "ativa" : ""}`}
            onClick={() => setTipo(item.valor)}
          >
            <Icon nome={item.icone} tamanho={20} />
            {item.rotulo}
          </button>
        ))}
      </div>

      <form className="busca-form" onSubmit={buscar} role="search">
        <Icon nome="busca" tamanho={22} />
        <input
          id="busca-principal"
          type="search"
          value={termo}
          onChange={(event) => setTermo(event.target.value)}
          placeholder={placeholder}
          aria-label="Pesquisar"
        />
        <button type="submit" className="button save">
          Buscar
        </button>
      </form>
    </div>
  );
}

export default BuscaHero;
