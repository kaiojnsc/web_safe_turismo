// Responsável: Lulinha (listagem + itens + ações de editar/excluir)
//
// Um card de ponto turístico (mesmo visual usado na Home e na Busca).
// Exibe os campos retornados pela query GET_PONTOS_TURISTICOS
// (nome, descricao, categoria, endereco, nivelRisco) e, para o perfil
// profissional, o seletor de risco e os botões de Editar e Excluir.

import CardLugar from "./CardLugar";
import RiscoSelect from "./RiscoSelect";
import { IMG_PONTO } from "../utils/helpers";

function PontoTuristicoItem({ pontoTuristico, podeEditar, onEdit, onDelete, onChangeRisco }) {
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
    <CardLugar
      imagem={IMG_PONTO}
      selo={pontoTuristico.categoria || "Ponto turístico"}
      risco={
        <RiscoSelect
          id={pontoTuristico.id}
          nome={pontoTuristico.nome}
          valor={pontoTuristico.nivelRisco}
          podeEditar={podeEditar}
          onChange={onChangeRisco}
        />
      }
      titulo={pontoTuristico.nome}
      local={pontoTuristico.endereco}
      descricao={pontoTuristico.descricao}
    >
      {podeEditar && (
        <>
          <button
            type="button"
            className="button edit pequeno"
            onClick={handleEditar}
            aria-label={`Editar ponto turístico ${pontoTuristico.nome}`}
          >
            Editar
          </button>
          <button
            type="button"
            className="button delete pequeno"
            onClick={handleExcluir}
            aria-label={`Excluir ponto turístico ${pontoTuristico.nome}`}
          >
            Excluir
          </button>
        </>
      )}
    </CardLugar>
  );
}

export default PontoTuristicoItem;
