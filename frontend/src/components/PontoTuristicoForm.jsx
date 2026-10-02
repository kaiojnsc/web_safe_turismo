import { useEffect, useState } from "react";

// Mesmo formulário para CADASTRAR (pontoTuristico = null)
// e para EDITAR (pontoTuristico = registro selecionado).
function PontoTuristicoForm({ pontoTuristico, onSave, onCancel }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [endereco, setEndereco] = useState("");

  useEffect(() => {
    if (pontoTuristico) {
      setNome(pontoTuristico.nome || "");
      setDescricao(pontoTuristico.descricao || "");
      setCategoria(pontoTuristico.categoria || "");
      setEndereco(pontoTuristico.endereco || "");
    } else {
      limparCampos();
    }
  }, [pontoTuristico]);

  const limparCampos = () => {
    setNome("");
    setDescricao("");
    setCategoria("");
    setEndereco("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      id: pontoTuristico?.id,
      nome: nome.trim(),
      descricao: descricao.trim(),
      categoria: categoria.trim(),
      endereco: endereco.trim(),
    });
  };

  const handleCancel = () => {
    limparCampos();
    onCancel();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{pontoTuristico ? "Editar Ponto Turístico" : "Cadastrar Ponto Turístico"}</h2>

      <div className="form-group">
        <label htmlFor="pt-nome">Nome *</label>
        <input
          id="pt-nome"
          type="text"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="pt-descricao">Descrição *</label>
        <textarea
          id="pt-descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="pt-categoria">Categoria</label>
        <input
          id="pt-categoria"
          type="text"
          placeholder="Ex.: lazer, cultura, história"
          value={categoria}
          onChange={(event) => setCategoria(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="pt-endereco">Endereço</label>
        <input
          id="pt-endereco"
          type="text"
          value={endereco}
          onChange={(event) => setEndereco(event.target.value)}
        />
      </div>

      <div className="form-buttons">
        <button type="submit" className="button save">
          Salvar
        </button>
        <button type="button" className="button cancel" onClick={handleCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default PontoTuristicoForm;
