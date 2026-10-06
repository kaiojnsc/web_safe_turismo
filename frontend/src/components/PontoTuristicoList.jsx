// Responsável: Lulinha (listagem + itens + ações de editar/excluir)
//
// Tabela com todos os pontos turísticos retornados pela query GraphQL.
// - Mostra uma mensagem quando não há registros cadastrados.
// - Permite filtrar a lista por nome, descrição, categoria ou endereço.
// - As ações (Editar/Excluir) só aparecem para o perfil profissional.
import { useMemo, useState } from "react";

import PontoTuristicoItem from "./PontoTuristicoItem";

// Deixa o texto sem acento e em minúsculas para a busca
// encontrar "acude" em "Açude Velho".
const normalizar = (texto) =>
  (texto || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

function PontoTuristicoList({ pontosTuristicos, podeEditar, onEdit, onDelete }) {
  const [busca, setBusca] = useState("");

  const lista = Array.isArray(pontosTuristicos) ? pontosTuristicos : [];

  // Ordem alfabética pelo nome + filtro da busca.
  const filtrados = useMemo(() => {
    const termo = normalizar(busca);

    return [...lista]
      .sort((a, b) => (a.nome || "").localeCompare(b.nome || "", "pt-BR"))
      .filter((ponto) => {
        if (!termo) {
          return true;
        }

        return [ponto.nome, ponto.descricao, ponto.categoria, ponto.endereco]
          .map(normalizar)
          .some((campo) => campo.includes(termo));
      });
  }, [lista, busca]);

  // Nenhum registro no banco.
  if (lista.length === 0) {
    return <p className="empty">Nenhum ponto turístico cadastrado.</p>;
  }

  return (
    <div>
      <div className="form-group">
        <label htmlFor="pt-busca">Buscar ponto turístico</label>
        <input
          id="pt-busca"
          type="search"
          placeholder="Nome, descrição, categoria ou endereço"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
      </div>

      <p className="lista-total">
        {filtrados.length === lista.length
          ? `${lista.length} ponto(s) turístico(s) cadastrado(s)`
          : `${filtrados.length} de ${lista.length} ponto(s) turístico(s)`}
      </p>

      {filtrados.length === 0 ? (
        <p className="empty">
          Nenhum ponto turístico encontrado para "{busca}".
        </p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Endereço</th>
                {podeEditar && <th>Ações</th>}
              </tr>
            </thead>

            <tbody>
              {filtrados.map((pontoTuristico) => (
                <PontoTuristicoItem
                  key={pontoTuristico.id}
                  pontoTuristico={pontoTuristico}
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

export default PontoTuristicoList;
