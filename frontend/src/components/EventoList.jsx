// Responsável: Lulinha (listagem + itens + ações de editar/excluir)
//
// Tabela com todos os eventos retornados pela query GraphQL.
// - Mostra uma mensagem quando não há registros cadastrados.
// - Ordena os eventos pela data (mais próximos primeiro).
// - Permite filtrar a lista por nome, descrição ou local.
// - As ações (Editar/Excluir) só aparecem para o perfil profissional.
import { useMemo, useState } from "react";

import EventoItem from "./EventoItem";

// Deixa o texto sem acento e em minúsculas para a busca
// encontrar "sao joao" em "São João".
const normalizar = (texto) =>
  (texto || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

// Converte a data do evento em número para poder ordenar.
// Datas inválidas vão para o fim da lista.
const valorData = (data) => {
  if (!data) {
    return Number.MAX_SAFE_INTEGER;
  }

  const valor = /^\d+$/.test(String(data)) ? Number(data) : data;
  const tempo = new Date(valor).getTime();

  return Number.isNaN(tempo) ? Number.MAX_SAFE_INTEGER : tempo;
};

function EventoList({ eventos, podeEditar, onEdit, onDelete }) {
  const [busca, setBusca] = useState("");

  const lista = Array.isArray(eventos) ? eventos : [];

  // Ordena por data + aplica o filtro da busca.
  const filtrados = useMemo(() => {
    const termo = normalizar(busca);

    return [...lista]
      .sort((a, b) => valorData(a.data) - valorData(b.data))
      .filter((evento) => {
        if (!termo) {
          return true;
        }

        return [evento.nome, evento.descricao, evento.local]
          .map(normalizar)
          .some((campo) => campo.includes(termo));
      });
  }, [lista, busca]);

  // Nenhum registro no banco.
  if (lista.length === 0) {
    return <p className="empty">Nenhum evento cadastrado.</p>;
  }

  return (
    <div>
      <div className="form-group">
        <label htmlFor="ev-busca">Buscar evento</label>
        <input
          id="ev-busca"
          type="search"
          placeholder="Nome, descrição ou local"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
      </div>

      <p className="lista-total">
        {filtrados.length === lista.length
          ? `${lista.length} evento(s) cadastrado(s)`
          : `${filtrados.length} de ${lista.length} evento(s)`}
      </p>

      {filtrados.length === 0 ? (
        <p className="empty">Nenhum evento encontrado para "{busca}".</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Data</th>
                <th>Local</th>
                {podeEditar && <th>Ações</th>}
              </tr>
            </thead>

            <tbody>
              {filtrados.map((evento) => (
                <EventoItem
                  key={evento.id}
                  evento={evento}
                  podeEditar={podeEditar}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EventoList;
