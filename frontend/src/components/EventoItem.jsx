// Mostra a data no formato brasileiro (24/06/2026).
// timeZone "UTC" evita a data aparecer um dia antes por causa do fuso.
const formatarData = (data) =>
  data ? new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "-";

// Uma linha da tabela de eventos.
function EventoItem({ evento, podeEditar, onEdit, onDelete }) {
  return (
    <tr>
      <td>{evento.nome}</td>
      <td>{evento.descricao}</td>
      <td>{formatarData(evento.data)}</td>
      <td>{evento.local}</td>

      {podeEditar && (
        <td>
          <button className="button edit" onClick={() => onEdit(evento)}>
            Editar
          </button>
          <button className="button delete" onClick={() => onDelete(evento.id)}>
            Excluir
          </button>
        </td>
      )}
    </tr>
  );
}

export default EventoItem;
