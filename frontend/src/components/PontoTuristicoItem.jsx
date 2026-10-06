// Responsável: Lulinha (listagem + itens + ações de editar/excluir)
//
// Uma linha da tabela de pontos turísticos.
// Exibe os campos retornados pela query GET_PONTOS_TURISTICOS
// (nome, descricao, categoria, endereco) e, para o perfil profissional,
// os botões de Editar e Excluir.

// Campos opcionais vazios aparecem como "-" em vez de célula em branco.
const exibir = (valor) => (valor && String(valor).trim() ? valor : "-");

function PontoTuristicoItem({ pontoTuristico, podeEditar, onEdit, onDelete }) {
  // Encaminha o registro inteiro para o formulário de edição.
  const handleEditar = () => {
    if (onEdit) {
      onEdit(pontoTuristico);
    }
  };

  // Encaminha apenas o identificador para a exclusão.
  const handleExcluir = () => {
    if (onDelete && pontoTuristico.id) {
      onDelete(pontoTuristico.id);
    }
  };

  return (
    <tr>
      <td data-label="Nome">{pontoTuristico.nome}</td>
      <td data-label="Descrição">{pontoTuristico.descricao}</td>
      <td data-label="Categoria">{exibir(pontoTuristico.categoria)}</td>
      <td data-label="Endereço">{exibir(pontoTuristico.endereco)}</td>

      {podeEditar && (
        <td data-label="Ações">
          <button
            type="button"
            className="button edit"
            onClick={handleEditar}
            aria-label={`Editar ponto turístico ${pontoTuristico.nome}`}
          >
            Editar
          </button>
          <button
            type="button"
            className="button delete"
            onClick={handleExcluir}
            aria-label={`Excluir ponto turístico ${pontoTuristico.nome}`}
          >
            Excluir
          </button>
        </td>
      )}
    </tr>
  );
}

export default PontoTuristicoItem;
