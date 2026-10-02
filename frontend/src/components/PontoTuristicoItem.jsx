// Uma linha da tabela de pontos turísticos.
function PontoTuristicoItem({ pontoTuristico, podeEditar, onEdit, onDelete }) {
  return (
    <tr>
      <td>{pontoTuristico.nome}</td>
      <td>{pontoTuristico.descricao}</td>
      <td>{pontoTuristico.categoria || "-"}</td>
      <td>{pontoTuristico.endereco || "-"}</td>

      {podeEditar && (
        <td>
          <button className="button edit" onClick={() => onEdit(pontoTuristico)}>
            Editar
          </button>
          <button className="button delete" onClick={() => onDelete(pontoTuristico.id)}>
            Excluir
          </button>
        </td>
      )}
    </tr>
  );
}

export default PontoTuristicoItem;
