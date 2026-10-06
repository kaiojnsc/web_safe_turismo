// Responsável: Lulinha (listagem + itens + ações de editar/excluir)
//
// Um card de evento (mesmo visual usado na Home e na Busca).
// Exibe os campos retornados pela query GET_EVENTOS
// (nome, descricao, data, local, nivelRisco) e, para o perfil profissional,
// o seletor de risco e os botões de Editar e Excluir.

import CardLugar from "./CardLugar";
import RiscoSelect from "./RiscoSelect";
import { IMG_EVENTO, formatarData } from "../utils/helpers";

function EventoItem({ evento, podeEditar, onEdit, onDelete, onChangeRisco }) {
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
    <CardLugar
      imagem={IMG_EVENTO}
      selo={formatarData(evento.data)}
      risco={
        <RiscoSelect
          id={evento.id}
          nome={evento.nome}
          valor={evento.nivelRisco}
          podeEditar={podeEditar}
          onChange={onChangeRisco}
        />
      }
      titulo={evento.nome}
      local={evento.local}
      descricao={evento.descricao}
    >
      {podeEditar && (
        <>
          <button
            type="button"
            className="button edit pequeno"
            onClick={handleEditar}
            aria-label={`Editar evento ${evento.nome}`}
          >
            Editar
          </button>
          <button
            type="button"
            className="button delete pequeno"
            onClick={handleExcluir}
            aria-label={`Excluir evento ${evento.nome}`}
          >
            Excluir
          </button>
        </>
      )}
    </CardLugar>
  );
}

export default EventoItem;
