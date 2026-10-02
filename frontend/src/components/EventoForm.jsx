import { useEffect, useState } from "react";

// O backend devolve a data completa (ex.: "2026-06-24T00:00:00.000Z").
// O campo <input type="date"> precisa só de "2026-06-24".
const paraCampoData = (data) => (data ? data.slice(0, 10) : "");

// Mesmo formulário para CADASTRAR (evento = null)
// e para EDITAR (evento = registro selecionado).
function EventoForm({ evento, onSave, onCancel }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [local, setLocal] = useState("");

  useEffect(() => {
    if (evento) {
      setNome(evento.nome || "");
      setDescricao(evento.descricao || "");
      setData(paraCampoData(evento.data));
      setLocal(evento.local || "");
    } else {
      limparCampos();
    }
  }, [evento]);

  const limparCampos = () => {
    setNome("");
    setDescricao("");
    setData("");
    setLocal("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      id: evento?.id,
      nome: nome.trim(),
      descricao: descricao.trim(),
      data,
      local: local.trim(),
    });
  };

  const handleCancel = () => {
    limparCampos();
    onCancel();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{evento ? "Editar Evento" : "Cadastrar Evento"}</h2>

      <div className="form-group">
        <label htmlFor="ev-nome">Nome *</label>
        <input
          id="ev-nome"
          type="text"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="ev-descricao">Descrição *</label>
        <textarea
          id="ev-descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="ev-data">Data *</label>
        <input
          id="ev-data"
          type="date"
          value={data}
          onChange={(event) => setData(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="ev-local">Local *</label>
        <input
          id="ev-local"
          type="text"
          value={local}
          onChange={(event) => setLocal(event.target.value)}
          required
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

export default EventoForm;
