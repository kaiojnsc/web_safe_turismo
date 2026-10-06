// Responsável: Lulinha (listagem + itens + ações de editar/excluir)
//
// Uma linha da tabela de eventos.
// Exibe os campos retornados pela query GET_EVENTOS
// (nome, descricao, data, local) e, para o perfil profissional,
// os botões de Editar e Excluir.

// Mostra a data no formato brasileiro (24/06/2026).
// timeZone "UTC" evita a data aparecer um dia antes por causa do fuso.
// O backend pode devolver a data como texto ISO ou como número em texto
// (milissegundos), então os dois casos são tratados.
const formatarData = (data) => {
  if (!data) {
    return "-";
  }

  const valor = /^\d+$/.test(String(data)) ? Number(data) : data;
  const convertida = new Date(valor);

  if (Number.isNaN(convertida.getTime())) {
    return "-";
  }

  return convertida.toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

function EventoItem({ evento, podeEditar, onEdit, onDelete }) {
  // Encaminha o registro inteiro para o formulário de edição.
  const handleEditar = () => {
    if (onEdit) {
      onEdit(evento);
    }
  };

  // Encaminha apenas o identificador para a exclusão.
  const handleExcluir = () => {
    if (onDelete && evento.id) {
      onDelete(evento.id);
    }
  };

  return (
    <tr>
      <td data-label="Nome">{evento.nome}</td>
      <td data-label="Descrição">{evento.descricao}</td>
      <td data-label="Data">{formatarData(evento.data)}</td>
      <td data-label="Local">{evento.local || "-"}</td>

      {podeEditar && (
        <td data-label="Ações">
          <button
            type="button"
            className="button edit"
            onClick={handleEditar}
            aria-label={`Editar evento ${evento.nome}`}
          >
            Editar
          </button>
          <button
            type="button"
            className="button delete"
            onClick={handleExcluir}
            aria-label={`Excluir evento ${evento.nome}`}
          >
            Excluir
          </button>
        </td>
      )}
    </tr>
  );
}

export default EventoItem;
