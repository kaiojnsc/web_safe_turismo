import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_PONTOS_TURISTICOS } from "../graphql/queries";
import {
  CREATE_PONTO_TURISTICO,
  UPDATE_PONTO_TURISTICO,
  DELETE_PONTO_TURISTICO,
} from "../graphql/mutations";
import { useAuth } from "../context/AuthContext";

import PontoTuristicoList from "../components/PontoTuristicoList";
import PontoTuristicoForm from "../components/PontoTuristicoForm";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import LoginNecessario from "../components/LoginNecessario";

function PontosTuristicos() {
  const { usuario } = useAuth();

  // O backend só responde para usuários logados
  if (!usuario) {
    return <LoginNecessario titulo="Pontos Turísticos" />;
  }

  return <PontosTuristicosCrud />;
}

function PontosTuristicosCrud() {
  const { ehProfissional } = useAuth();

  const [selecionado, setSelecionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [erroAcao, setErroAcao] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_PONTOS_TURISTICOS);

  const [createPontoTuristico] = useMutation(CREATE_PONTO_TURISTICO);
  const [updatePontoTuristico] = useMutation(UPDATE_PONTO_TURISTICO);
  const [deletePontoTuristico] = useMutation(DELETE_PONTO_TURISTICO);

  const handleSave = async (pontoTuristico) => {
    setErroAcao("");

    const { id, ...input } = pontoTuristico;

    try {
      if (id) {
        await updatePontoTuristico({ variables: { id, input } });
      } else {
        await createPontoTuristico({ variables: { input } });
      }

      await refetch();
      setSelecionado(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar ponto turístico:", error);
      setErroAcao(`Não foi possível salvar: ${error.message}`);
    }
  };

  const handleEdit = (pontoTuristico) => {
    setErroAcao("");
    setSelecionado(pontoTuristico);
    setMostrarFormulario(true);
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("Deseja realmente excluir este ponto turístico?");

    if (!confirmar) {
      return;
    }

    setErroAcao("");

    try {
      await deletePontoTuristico({ variables: { id } });
      await refetch();
    } catch (error) {
      console.error("Erro ao excluir ponto turístico:", error);
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
        <h1>Pontos Turísticos</h1>

        {ehProfissional && (
          <button className="button save" onClick={handleNew}>
            + Novo Ponto Turístico
          </button>
        )}
      </div>

      <ErrorMessage message={erroAcao} />

      {mostrarFormulario && (
        <PontoTuristicoForm
          pontoTuristico={selecionado}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <PontoTuristicoList
        pontosTuristicos={data?.pontosTuristicos || []}
        podeEditar={ehProfissional}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default PontosTuristicos;
