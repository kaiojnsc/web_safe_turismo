import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_PONTOS_TURISTICOS } from "../graphql/queries";
import {
  CREATE_PONTO_TURISTICO,
  UPDATE_PONTO_TURISTICO,
  DELETE_PONTO_TURISTICO,
  SET_RISCO_PONTO_TURISTICO,
} from "../graphql/mutations";
import { useAuth } from "../context/AuthContext";

import PontoTuristicoList from "../components/PontoTuristicoList";
import PontoTuristicoForm from "../components/PontoTuristicoForm";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";

// Página pública: qualquer visitante consulta os pontos turísticos.
// Só o perfil profissional vê os controles de cadastro, edição, exclusão e risco
// (e o backend confere a permissão de novo em cada mutation).
// "embutido" é usado dentro do Painel profissional (sem o cabeçalho da página).
function PontosTuristicos({ embutido = false }) {
  const { ehProfissional } = useAuth();

  const [selecionado, setSelecionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [erroAcao, setErroAcao] = useState("");
  const [sucesso, setSucesso] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_PONTOS_TURISTICOS);

  const [createPontoTuristico] = useMutation(CREATE_PONTO_TURISTICO);
  const [updatePontoTuristico] = useMutation(UPDATE_PONTO_TURISTICO);
  const [deletePontoTuristico] = useMutation(DELETE_PONTO_TURISTICO);
  const [setRisco] = useMutation(SET_RISCO_PONTO_TURISTICO);

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

  const handleSave = async (pontoTuristico) => {
    limparAvisos();

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
      setSucesso(id ? "Ponto turístico atualizado." : "Ponto turístico cadastrado.");
    } catch (error) {
      setErroAcao(`Não foi possível salvar: ${error.message}`);
    }
  };

  const handleEdit = (pontoTuristico) => {
    limparAvisos();
    setSelecionado(pontoTuristico);
    setMostrarFormulario(true);
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("Deseja realmente excluir este ponto turístico?");

    if (!confirmar) {
      return;
    }

    limparAvisos();

    try {
      await deletePontoTuristico({ variables: { id } });
      await refetch();
      setSucesso("Ponto turístico excluído.");
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
          {!embutido && <span className="eyebrow">Descubra lugares</span>}
          <Titulo>Pontos turísticos</Titulo>
        </div>

        {ehProfissional && (
          <button type="button" className="button save" onClick={handleNew}>
            + Novo ponto turístico
          </button>
        )}
      </div>

      <SuccessMessage message={sucesso} />
      <ErrorMessage message={erroAcao} />

      {mostrarFormulario && ehProfissional && (
        <PontoTuristicoForm
          pontoTuristico={selecionado}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {loading && !data && <Loading />}
      <ErrorMessage message={error && !data ? error.message : ""} />

      {data && (
        <PontoTuristicoList
          pontosTuristicos={data.pontosTuristicos || []}
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

export default PontosTuristicos;
