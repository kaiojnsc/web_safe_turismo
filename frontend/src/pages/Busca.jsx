import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";

import { GET_DESCOBERTA } from "../graphql/queries";
import {
  IMG_EVENTO,
  IMG_PONTO,
  combinaBusca,
  formatarData,
  imagemEstabelecimento,
  valorData,
} from "../utils/helpers";

import BuscaHero from "../components/BuscaHero";
import CardLugar from "../components/CardLugar";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import RiscoSelect from "../components/RiscoSelect";

// Resultados combinados de pontos turísticos, eventos e estabelecimentos.
// O termo e o tipo vêm da URL (/busca?q=parque&tipo=pontos), então a busca
// funciona ao recarregar a página e pode ser compartilhada.
function Busca() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const tipo = params.get("tipo") || "tudo";

  const { loading, error, data } = useQuery(GET_DESCOBERTA);

  const pontos = (data?.pontosTuristicos || []).filter(
    (p) =>
      (tipo === "tudo" || tipo === "pontos") &&
      combinaBusca([p.nome, p.descricao, p.categoria, p.endereco, "ponto turistico"], q)
  );

  const eventos = (data?.eventos || [])
    .filter(
      (e) =>
        (tipo === "tudo" || tipo === "eventos") &&
        combinaBusca([e.nome, e.descricao, e.local, "evento"], q)
    )
    .sort((a, b) => valorData(a.data) - valorData(b.data));

  const estabelecimentos = (data?.estabelecimentos || []).filter(
    (e) =>
      (tipo === "tudo" || tipo === "estabelecimentos") &&
      combinaBusca([e.nome, e.descricao, e.categoria, e.cidade, e.endereco, "estabelecimento"], q)
  );

  const total = pontos.length + eventos.length + estabelecimentos.length;

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Busca</span>
          <h1>{q ? `Resultados para “${q}”` : "Explorar tudo"}</h1>
        </div>
      </div>

      {/* key faz o campo refletir o termo da URL */}
      <BuscaHero key={`${q}|${tipo}`} qInicial={q} tipoInicial={tipo} />

      <div style={{ marginTop: "2.5rem" }}>
        {loading && <Loading />}
        <ErrorMessage message={error ? error.message : ""} />

        {!loading && !error && (
          <>
            <p className="lista-total">{total} resultado(s) encontrado(s)</p>

            {total === 0 && (
              <div className="empty">
                <strong>Nada encontrado</strong>
                Tente outro termo, como “parque”, “restaurante” ou o nome de uma cidade.
              </div>
            )}

            {pontos.length > 0 && (
              <section className="busca-secao">
                <h2>Pontos turísticos ({pontos.length})</h2>
                <div className="cards-grid">
                  {pontos.map((p) => (
                    <CardLugar
                      key={p.id}
                      imagem={IMG_PONTO}
                      selo={p.categoria || "Ponto turístico"}
                      risco={<RiscoSelect valor={p.nivelRisco} />}
                      titulo={p.nome}
                      local={p.endereco}
                      descricao={p.descricao}
                    />
                  ))}
                </div>
              </section>
            )}

            {eventos.length > 0 && (
              <section className="busca-secao">
                <h2>Eventos ({eventos.length})</h2>
                <div className="cards-grid">
                  {eventos.map((e) => (
                    <CardLugar
                      key={e.id}
                      imagem={IMG_EVENTO}
                      selo={formatarData(e.data)}
                      risco={<RiscoSelect valor={e.nivelRisco} />}
                      titulo={e.nome}
                      local={e.local}
                      descricao={e.descricao}
                    />
                  ))}
                </div>
              </section>
            )}

            {estabelecimentos.length > 0 && (
              <section className="busca-secao">
                <h2>Estabelecimentos ({estabelecimentos.length})</h2>
                <div className="cards-grid">
                  {estabelecimentos.map((e) => (
                    <CardLugar
                      key={e.id}
                      imagem={imagemEstabelecimento(e.categoria)}
                      selo={e.categoria}
                      titulo={e.nome}
                      local={[e.cidade, e.endereco].filter(Boolean).join(" · ")}
                      descricao={e.descricao}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default Busca;
