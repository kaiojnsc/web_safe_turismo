import EventoItem from "./EventoItem";

// Tabela com todos os eventos.
// As ações (Editar/Excluir) só aparecem para o perfil profissional.
function EventoList({ eventos, podeEditar, onEdit, onDelete }) {
  if (!eventos || eventos.length === 0) {
    return <p className="empty">Nenhum evento cadastrado.</p>;
  }

  return (
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
          {eventos.map((evento) => (
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
  );
}

export default EventoList;
