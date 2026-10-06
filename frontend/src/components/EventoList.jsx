// Responsável: Lulinha (listagem + itens + ações de editar/excluir)
//
// Grade de cards com os eventos retornados pela query GraphQL.
// - Mostra uma mensagem quando não há registros cadastrados.
// - Ordena os eventos pela data (mais próximos primeiro).
// - Permite filtrar a lista por texto (nome, descrição, local) e nível de risco.
// - As ações (Editar/Excluir/alterar risco) só aparecem para o perfil profissional.
import { useMemo, useState } from "react";

import EventoItem from "./EventoItem";
import { NIVEIS_RISCO } from "./RiscoSelect";
import { combinaBusca, valorData } from "../utils/helpers";

function EventoList({ eventos, podeEditar, onEdit, onDelete, onChangeRisco }) {
  const [busca, setBusca] = useState("");
  const [risco, setRisco] = useState("");

  const lista = Array.isArray(eventos) ? eventos : [];

  // Ordena por data + aplica os filtros.
  const filtrados = useMemo(
    () =>
      [...lista]
        .sort((a, b) => valorData(a.data) - valorData(b.data))
        .filter(
          (evento) =>
            (!risco || (evento.nivelRisco || "baixo") === risco) &&
            combinaBusca([evento.nome, evento.descricao, evento.local], busca)
        ),
    [lista, busca, risco]
  );

  // Nenhum registro no banco.
  if (lista.length === 0) {
    return (
      <div className="empty">
        <strong>Nenhum evento cadastrado</strong>
        Volte em breve para conferir a agenda.
      </div>
    );
  }

  return (
    <div>
      <div className="busca-barra">
        <div className="campo-busca">
          <input
            id="ev-busca"
            type="search"
            placeholder="Buscar por nome, descrição ou local"
            aria-label="Buscar evento"
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
          ? `${lista.length} evento(s) cadastrado(s)`
          : `${filtrados.length} de ${lista.length} evento(s)`}
      </p>

      {filtrados.length === 0 ? (
        <div className="empty">
          <strong>Nenhum resultado</strong>
          Nenhum evento encontrado para esta busca.
        </div>
      ) : (
        <div className="cards-grid">
          {filtrados.map((evento) => (
            <EventoItem
              key={evento.id}
              evento={evento}
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

export default EventoList;
