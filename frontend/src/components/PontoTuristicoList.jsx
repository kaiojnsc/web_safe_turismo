import PontoTuristicoItem from "./PontoTuristicoItem";

// Tabela com todos os pontos turísticos.
// As ações (Editar/Excluir) só aparecem para o perfil profissional.
function PontoTuristicoList({ pontosTuristicos, podeEditar, onEdit, onDelete }) {
  if (!pontosTuristicos || pontosTuristicos.length === 0) {
    return <p className="empty">Nenhum ponto turístico cadastrado.</p>;
  }

  return (
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
          {pontosTuristicos.map((pontoTuristico) => (
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
  );
}

export default PontoTuristicoList;
