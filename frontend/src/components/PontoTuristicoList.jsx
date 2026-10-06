// Responsável: Lulinha (listagem + itens + ações de editar/excluir)
//
// Grade de cards com os pontos turísticos retornados pela query GraphQL.
// - Mostra uma mensagem quando não há registros cadastrados.
// - Permite filtrar a lista por texto (nome, descrição, categoria, endereço)
//   e por nível de risco.
// - As ações (Editar/Excluir/alterar risco) só aparecem para o perfil profissional.
import { useMemo, useState } from "react";

import PontoTuristicoItem from "./PontoTuristicoItem";
import { NIVEIS_RISCO } from "./RiscoSelect";
import { combinaBusca } from "../utils/helpers";

function PontoTuristicoList({ pontosTuristicos, podeEditar, onEdit, onDelete, onChangeRisco }) {
  const [busca, setBusca] = useState("");
  const [risco, setRisco] = useState("");

  const lista = Array.isArray(pontosTuristicos) ? pontosTuristicos : [];

  // Ordem alfabética pelo nome + filtros.
  const filtrados = useMemo(
    () =>
      [...lista]
        .sort((a, b) => (a.nome || "").localeCompare(b.nome || "", "pt-BR"))
        .filter(
          (ponto) =>
            (!risco || (ponto.nivelRisco || "baixo") === risco) &&
            combinaBusca([ponto.nome, ponto.descricao, ponto.categoria, ponto.endereco], busca)
        ),
    [lista, busca, risco]
  );

  // Nenhum registro no banco.
  if (lista.length === 0) {
    return (
      <div className="empty">
        <strong>Nenhum ponto turístico cadastrado</strong>
        Assim que forem cadastrados eles aparecem aqui.
      </div>
    );
  }

  return (
    <div>
      <div className="busca-barra">
        <div className="campo-busca">
          <input
            id="pt-busca"
            type="search"
            placeholder="Buscar por nome, categoria ou endereço"
            aria-label="Buscar ponto turístico"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
        </div>

        <select
          className="select-filtro"
          aria-label="Filtrar por nível de risco"
          value={risco}
          onChange={(event) => setRisco(event.target.value)}
        >
          <option value="">Todos os riscos</option>
          {NIVEIS_RISCO.map((nivel) => (
            <option key={nivel.valor} value={nivel.valor}>
              Risco {nivel.rotulo.toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <p className="lista-total">
        {filtrados.length === lista.length
          ? `${lista.length} ponto(s) turístico(s) cadastrado(s)`
          : `${filtrados.length} de ${lista.length} ponto(s) turístico(s)`}
      </p>

      {filtrados.length === 0 ? (
        <div className="empty">
          <strong>Nenhum resultado</strong>
          Nenhum ponto turístico encontrado para esta busca.
        </div>
      ) : (
        <div className="cards-grid">
          {filtrados.map((pontoTuristico) => (
            <PontoTuristicoItem
              key={pontoTuristico.id}
              pontoTuristico={pontoTuristico}
              podeEditar={podeEditar}
              onEdit={onEdit}
              onDelete={onDelete}
              onChangeRisco={onChangeRisco}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PontoTuristicoList;
