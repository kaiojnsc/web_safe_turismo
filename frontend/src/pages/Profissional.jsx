import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";

import { GET_AREAS_RISCO, GET_DESCOBERTA } from "../graphql/queries";
import { useAuth } from "../context/AuthContext";

import ErrorMessage from "../components/ErrorMessage";
import Estabelecimentos from "./Estabelecimentos";
import Eventos from "./Eventos";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import PainelRisco from "../components/PainelRisco";
import PontosTuristicos from "./PontosTuristicos";
import "./Profissional.css";

const ABAS = [
  { id: "resumo", rotulo: "Resumo" },
  { id: "pontos", rotulo: "Pontos turísticos" },
  { id: "eventos", rotulo: "Eventos" },
  { id: "estabelecimentos", rotulo: "Estabelecimentos" },
  { id: "riscos", rotulo: "Níveis de risco" },
];

function Resumo({ aoAbrir }) {
  const { loading, error, data } = useQuery(GET_DESCOBERTA);
  const { data: dadosAreas } = useQuery(GET_AREAS_RISCO);

  if (loading && !data) {
    return <Loading />;
  }

  if (error && !data) {
    return <ErrorMessage message={error.message} />;
  }

  const pontos = data?.pontosTuristicos || [];
  const eventos = data?.eventos || [];
  const estabelecimentos = data?.estabelecimentos || [];
  const areas = dadosAreas?.areasDeRisco || [];

  const emAlto = [...pontos, ...eventos].filter((item) => item.nivelRisco === "alto").length;
  const emMedio = [...pontos, ...eventos].filter((item) => item.nivelRisco === "medio").length;

  const cartoes = [
    { aba: "pontos", icone: "camera", numero: pontos.length, rotulo: "Pontos turísticos" },
    { aba: "eventos", icone: "calendario", numero: eventos.length, rotulo: "Eventos" },
    { aba: "estabelecimentos", icone: "loja", numero: estabelecimentos.length, rotulo: "Estabelecimentos" },
    { aba: "riscos", icone: "escudo", numero: emAlto, rotulo: "Itens com risco alto" },
  ];

  return (
    <section>
      <ul className="painel-cartoes">
        {cartoes.map((cartao) => (
          <li key={cartao.aba}>
            <button type="button" className="painel-cartao" onClick={() => aoAbrir(cartao.aba)}>
              <span className="painel-cartao-icone">
                <Icon nome={cartao.icone} tamanho={24} />
              </span>
              <strong>{cartao.numero}</strong>
              <span>{cartao.rotulo}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="painel-atalhos">
        <div>
          <h2>Situação dos níveis de risco</h2>
          <p>
            {emAlto} item(ns) com risco alto, {emMedio} com risco médio e {areas.length} área(s)
            monitorada(s).
          </p>
          <button type="button" className="button save" onClick={() => aoAbrir("riscos")}>
            Revisar níveis de risco
          </button>
        </div>

        <div>
          <h2>Ver como o turista</h2>
          <p>Confira a Home e as páginas públicas exatamente como os visitantes as enxergam.</p>
          <Link to="/" className="button ghost">
            Abrir a Home
          </Link>
        </div>
      </div>
    </section>
  );
}

// Painel do administrador global (perfil "profissional").
// Reúne as telas de administração já existentes; cada uma continua sendo
// protegida também no backend.
function Profissional() {
  const { usuario } = useAuth();
  const [params, setParams] = useSearchParams();

  const abaAtual = ABAS.some((aba) => aba.id === params.get("aba")) ? params.get("aba") : "resumo";

  const abrir = (id) => setParams(id === "resumo" ? {} : { aba: id });

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Administração do SafeTour</span>
          <h1>Painel profissional</h1>
          <p className="page-subtitulo">
            Olá, {usuario?.nome}. Gerencie pontos turísticos, eventos, estabelecimentos e níveis de
            risco.
          </p>
        </div>
      </div>

      <div className="abas" role="tablist" aria-label="Seções do painel">
        {ABAS.map((aba) => (
          <button
            key={aba.id}
            type="button"
            role="tab"
            id={`aba-${aba.id}`}
            aria-selected={abaAtual === aba.id}
            aria-controls="painel-conteudo"
            className={`aba ${abaAtual === aba.id ? "ativa" : ""}`}
            onClick={() => abrir(aba.id)}
          >
            {aba.rotulo}
          </button>
        ))}
      </div>

      <div id="painel-conteudo" role="tabpanel" aria-labelledby={`aba-${abaAtual}`}>
        {abaAtual === "resumo" && <Resumo aoAbrir={abrir} />}
        {abaAtual === "pontos" && <PontosTuristicos embutido />}
        {abaAtual === "eventos" && <Eventos embutido />}
        {abaAtual === "estabelecimentos" && <Estabelecimentos embutido />}
        {abaAtual === "riscos" && <PainelRisco />}
      </div>
    </main>
  );
}

export default Profissional;
