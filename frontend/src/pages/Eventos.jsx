import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_EVENTOS } from "../graphql/queries";
import {
  CREATE_EVENTO,
  UPDATE_EVENTO,
  DELETE_EVENTO,
} from "../graphql/mutations";
import { useAuth } from "../context/AuthContext";

import EventoList from "../components/EventoList";
import EventoForm from "../components/EventoForm";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import LoginNecessario from "../components/LoginNecessario";

function Eventos() {
  const { usuario } = useAuth();

  // O backend só responde para usuários logados
  if (!usuario) {
    return <LoginNecessario titulo="Eventos" />;
  }

  return <EventosCrud />;
}

function EventosCrud() {
  const { ehProfissional } = useAuth();

  const [selecionado, setSelecionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [erroAcao, setErroAcao] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_EVENTOS);

  const [createEvento] = useMutation(CREATE_EVENTO);
  const [updateEvento] = useMutation(UPDATE_EVENTO);
  const [deleteEvento] = useMutation(DELETE_EVENTO);

  const handleSave = async (evento) => {
    setErroAcao("");

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
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      setErroAcao(`Não foi possível salvar: ${error.message}`);
    }
  };

  const handleEdit = (evento) => {
    setErroAcao("");
    setSelecionado(evento);
    setMostrarFormulario(true);
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("Deseja realmente excluir este evento?");

    if (!confirmar) {
      return;
    }

    setErroAcao("");

    try {
      await deleteEvento({ variables: { id } });
      await refetch();
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      setErroAcao(`Não foi possível excluir: ${error.message}`);
    }
  };

  const handleNew = () => {
    setErroAcao("");
    setSelecionado(null);
    setMostrarFormulario(true);
  };

  const handleCancel = () => {
    setSelecionado(null);
    setMostrarFormulario(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="page">
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Eventos</h1>

        {ehProfissional && (
          <button className="button save" onClick={handleNew}>
            + Novo Evento
          </button>
        )}
      </div>

      <ErrorMessage message={erroAcao} />

      {mostrarFormulario && (
        <EventoForm
          evento={selecionado}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <EventoList
        eventos={data?.eventos || []}
        podeEditar={ehProfissional}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Eventos;
