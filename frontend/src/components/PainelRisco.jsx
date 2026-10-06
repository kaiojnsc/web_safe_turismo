import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_AREAS_RISCO, GET_DESCOBERTA } from "../graphql/queries";
import { SET_RISCO_EVENTO, SET_RISCO_PONTO_TURISTICO } from "../graphql/mutations";
import { formatarData, valorData } from "../utils/helpers";

import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";
import RiscoSelect from "./RiscoSelect";
import SuccessMessage from "./SuccessMessage";

// Visão única dos níveis de risco: o profissional ajusta pontos turísticos e
// eventos em um só lugar. As áreas monitoradas aparecem apenas para consulta.
function PainelRisco() {
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_DESCOBERTA);
  const { data: dadosAreas } = useQuery(GET_AREAS_RISCO);

  const [setRiscoPonto] = useMutation(SET_RISCO_PONTO_TURISTICO);
  const [setRiscoEvento] = useMutation(SET_RISCO_EVENTO);

  const alterar = (mutation) => async (id, nivelRisco) => {
    setErro("");
    setSucesso("");

    try {
      await mutation({ variables: { id, nivelRisco } });
      await refetch();
      setSucesso("Nível de risco atualizado.");
    } catch (falha) {
      setErro(`Não foi possível alterar o risco: ${falha.message}`);
    }
  };

  const pontos = [...(data?.pontosTuristicos || [])].sort((a, b) =>
    (a.nome || "").localeCompare(b.nome || "", "pt-BR")
  );
  const eventos = [...(data?.eventos || [])].sort((a, b) => valorData(a.data) - valorData(b.data));
  const areas = dadosAreas?.areasDeRisco || [];

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Níveis de risco</h2>
          <p className="page-subtitulo">
            Defina o risco de cada ponto turístico e evento. Turistas e instituições apenas
            consultam essa informação.
          </p>
        </div>
      </div>

      <SuccessMessage message={sucesso} />
      <ErrorMessage message={erro} />
      {loading && !data && <Loading />}
      <ErrorMessage message={error && !data ? error.message : ""} />

      {data && (
        <div className="risco-colunas">
          <div className="risco-bloco">
            <h3>Pontos turísticos ({pontos.length})</h3>
            {pontos.length === 0 ? (
              <p className="empty">Nenhum ponto turístico cadastrado.</p>
            ) : (
              <ul className="risco-lista">
                {pontos.map((ponto) => (
                  <li key={ponto.id}>
                    <span className="risco-lista-nome">
                      <strong>{ponto.nome}</strong>
                      {ponto.categoria && <small>{ponto.categoria}</small>}
                    </span>
                    <RiscoSelect
                      id={ponto.id}
                      nome={ponto.nome}
                      valor={ponto.nivelRisco}
                      podeEditar
                      onChange={alterar(setRiscoPonto)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="risco-bloco">
            <h3>Eventos ({eventos.length})</h3>
            {eventos.length === 0 ? (
              <p className="empty">Nenhum evento cadastrado.</p>
            ) : (
              <ul className="risco-lista">
                {eventos.map((evento) => (
                  <li key={evento.id}>
                    <span className="risco-lista-nome">
                      <strong>{evento.nome}</strong>
                      <small>{formatarData(evento.data)}</small>
                    </span>
                    <RiscoSelect
                      id={evento.id}
                      nome={evento.nome}
                      valor={evento.nivelRisco}
                      podeEditar
                      onChange={alterar(setRiscoEvento)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {areas.length > 0 && (
        <div className="risco-bloco risco-areas">
          <h3>Áreas monitoradas (somente consulta)</h3>
          <ul className="risco-lista">
            {areas.map((area) => (
              <li key={area.id}>
                <span className="risco-lista-nome">
                  <strong>{area.cidade}</strong>
                  {area.regiao && <small>{area.regiao}</small>}
                </span>
                <RiscoSelect valor={area.nivel} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default PainelRisco;
