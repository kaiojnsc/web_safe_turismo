import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_EVENTOS } from "../graphql/queries";
import {
  CREATE_EVENTO,
  UPDATE_EVENTO,
  DELETE_EVENTO,
  SET_RISCO_EVENTO,
} from "../graphql/mutations";
import { useAuth } from "../context/AuthContext";

import EventoList from "../components/EventoList";
import EventoForm from "../components/EventoForm";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";

// Página pública: qualquer visitante consulta os eventos.
// Só o perfil profissional vê os controles de cadastro, edição, exclusão e risco
// (e o backend confere a permissão de novo em cada mutation).
// "embutido" é usado dentro do Painel profissional (sem o cabeçalho da página).
function Eventos({ embutido = false }) {
  const { ehProfissional } = useAuth();

  const [selecionado, setSelecionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [erroAcao, setErroAcao] = useState("");
  const [sucesso, setSucesso] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_EVENTOS);

  const [createEvento] = useMutation(CREATE_EVENTO);
  const [updateEvento] = useMutation(UPDATE_EVENTO);
  const [deleteEvento] = useMutation(DELETE_EVENTO);
  const [setRisco] = useMutation(SET_RISCO_EVENTO);

  const limparAvisos = () => {
    setErroAcao("");
    setSucesso("");
  };

  const handleChangeRisco = async (id, nivelRisco) => {
    limparAvisos();

    try {
      await setRisco({ variables: { id, nivelRisco } });
      await refetch();
      setSucesso("Nível de risco atualizado.");
    } catch (error) {
      setErroAcao(`Não foi possível alterar o risco: ${error.message}`);
    }
  };

  const handleSave = async (evento) => {
    limparAvisos();

    const { id, ...input } = evento;

    try {
      if (id) {
        await updateEvento({ variables: { id, input } });
      } else {
        await createEvento({ variables: { input } });
      }

      await refetch();
      setSelecionado(null);
      setMostrarFormulario(false);
      setSucesso(id ? "Evento atualizado." : "Evento cadastrado.");
    } catch (error) {
      setErroAcao(`Não foi possível salvar: ${error.message}`);
    }
  };

  const handleEdit = (evento) => {
    limparAvisos();
    setSelecionado(evento);
    setMostrarFormulario(true);
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("Deseja realmente excluir este evento?");

    if (!confirmar) {
      return;
    }

    limparAvisos();

    try {
      await deleteEvento({ variables: { id } });
      await refetch();
      setSucesso("Evento excluído.");
    } catch (error) {
      setErroAcao(`Não foi possível excluir: ${error.message}`);
    }
  };

  const handleNew = () => {
    limparAvisos();
    setSelecionado(null);
    setMostrarFormulario(true);
  };

  const handleCancel = () => {
    setSelecionado(null);
    setMostrarFormulario(false);
  };

  const Titulo = embutido ? "h2" : "h1";

  const conteudo = (
    <>
      <div className="page-header">
        <div>
          {!embutido && <span className="eyebrow">Agenda</span>}
          <Titulo>Eventos</Titulo>
        </div>

        {ehProfissional && (
          <button type="button" className="button save" onClick={handleNew}>
            + Novo evento
          </button>
        )}
      </div>

      <SuccessMessage message={sucesso} />
      <ErrorMessage message={erroAcao} />

      {mostrarFormulario && ehProfissional && (
        <EventoForm evento={selecionado} onSave={handleSave} onCancel={handleCancel} />
      )}

      {loading && !data && <Loading />}
      <ErrorMessage message={error && !data ? error.message : ""} />

      {data && (
        <EventoList
          eventos={data.eventos || []}
          podeEditar={ehProfissional}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onChangeRisco={handleChangeRisco}
        />
      )}
    </>
  );

  return embutido ? <section>{conteudo}</section> : <main className="page">{conteudo}</main>;
}

export default Eventos;
