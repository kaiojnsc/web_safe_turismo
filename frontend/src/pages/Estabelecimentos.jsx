import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_ESTABELECIMENTOS } from "../graphql/queries";
import {
  CREATE_ESTABELECIMENTO,
  DELETE_ESTABELECIMENTO,
  UPDATE_ESTABELECIMENTO,
} from "../graphql/mutations";
import { useAuth } from "../context/AuthContext";
import { combinaBusca, imagemEstabelecimento, unicos } from "../utils/helpers";

import CardLugar from "../components/CardLugar";
import ErrorMessage from "../components/ErrorMessage";
import EstabelecimentoForm from "../components/EstabelecimentoForm";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import SuccessMessage from "../components/SuccessMessage";

const linkMapa = (lat, lon) =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`;

// Página pública: qualquer visitante consulta os estabelecimentos.
// O profissional (administrador) também pode cadastrar, editar e excluir aqui.
// "embutido" é usado dentro do Painel profissional (sem o cabeçalho da página).
function Estabelecimentos({ embutido = false }) {
  const { ehProfissional } = useAuth();

  const [busca, setBusca] = useState("");
  const [cidade, setCidade] = useState("");
  const [categoria, setCategoria] = useState("");

  const [selecionado, setSelecionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [erroAcao, setErroAcao] = useState("");
  const [sucesso, setSucesso] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_ESTABELECIMENTOS);

  const [criar, { loading: criando }] = useMutation(CREATE_ESTABELECIMENTO);
  const [atualizar, { loading: atualizando }] = useMutation(UPDATE_ESTABELECIMENTO);
  const [excluir] = useMutation(DELETE_ESTABELECIMENTO);

  const lista = useMemo(() => data?.estabelecimentos || [], [data]);
  const cidades = useMemo(() => unicos(lista.map((e) => e.cidade)), [lista]);
  const categorias = useMemo(() => unicos(lista.map((e) => e.categoria)), [lista]);

  const filtrados = useMemo(
    () =>
      lista.filter(
        (e) =>
          (!cidade || e.cidade === cidade) &&
          (!categoria || e.categoria === categoria) &&
          combinaBusca([e.nome, e.descricao, e.categoria, e.cidade, e.endereco], busca)
      ),
    [lista, busca, cidade, categoria]
  );

  const limparAvisos = () => {
    setErroAcao("");
    setSucesso("");
  };

  const handleNovo = () => {
    limparAvisos();
    setSelecionado(null);
    setMostrarFormulario(true);
  };

  const handleEditar = (estabelecimento) => {
    limparAvisos();
    setSelecionado(estabelecimento);
    setMostrarFormulario(true);
  };

  const handleCancelar = () => {
    setSelecionado(null);
    setMostrarFormulario(false);
  };

  const handleSalvar = async (input) => {
    limparAvisos();

    try {
      if (selecionado) {
        await atualizar({ variables: { id: selecionado.id, input } });
      } else {
        await criar({ variables: { input } });
      }

      await refetch();
      setSucesso(selecionado ? "Estabelecimento atualizado." : "Estabelecimento cadastrado.");
      handleCancelar();
    } catch (falha) {
      setErroAcao(`Não foi possível salvar: ${falha.message}`);
    }
  };

  const handleExcluir = async (estabelecimento) => {
    const confirmar = window.confirm(
      `Deseja realmente excluir o estabelecimento "${estabelecimento.nome}"?`
    );

    if (!confirmar) {
      return;
    }

    limparAvisos();

    try {
      await excluir({ variables: { id: estabelecimento.id } });
      await refetch();
      setSucesso("Estabelecimento excluído.");
    } catch (falha) {
      setErroAcao(`Não foi possível excluir: ${falha.message}`);
    }
  };

  const Titulo = embutido ? "h2" : "h1";

  const conteudo = (
    <>
      <div className="page-header">
        <div>
          {!embutido && <span className="eyebrow">Para comer e se hospedar</span>}
          <Titulo>Estabelecimentos</Titulo>
          {!embutido && (
            <p className="page-subtitulo">
              Restaurantes, hospedagens e serviços cadastrados por instituições parceiras.
            </p>
          )}
        </div>

        {ehProfissional && (
          <button type="button" className="button save" onClick={handleNovo}>
            + Novo estabelecimento
          </button>
        )}
      </div>

      <SuccessMessage message={sucesso} />
      <ErrorMessage message={erroAcao} />

      {mostrarFormulario && ehProfissional && (
        <EstabelecimentoForm
          estabelecimento={selecionado}
          onSave={handleSalvar}
          onCancel={handleCancelar}
          salvando={criando || atualizando}
        />
      )}

      {loading && !data && <Loading />}
      <ErrorMessage message={error && !data ? error.message : ""} />

      {data && lista.length === 0 && (
        <div className="empty">
          <strong>Nenhum estabelecimento cadastrado</strong>
          Instituições podem criar uma conta e divulgar seu espaço no SafeTour.
        </div>
      )}

      {data && lista.length > 0 && (
        <>
          <div className="busca-barra">
            <div className="campo-busca">
              <Icon nome="busca" tamanho={20} />
              <input
                type="search"
                placeholder="Buscar por nome, categoria ou endereço"
                aria-label="Buscar estabelecimento"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
              />
            </div>

            <select
              className="select-filtro"
              aria-label="Filtrar por cidade"
              value={cidade}
              onChange={(event) => setCidade(event.target.value)}
            >
              <option value="">Todas as cidades</option>
              {cidades.map((nome) => (
                <option key={nome} value={nome}>
                  {nome}
                </option>
              ))}
            </select>

            <select
              className="select-filtro"
              aria-label="Filtrar por categoria"
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categorias.map((nome) => (
                <option key={nome} value={nome}>
                  {nome}
                </option>
              ))}
            </select>
          </div>

          <p className="lista-total">
            {filtrados.length === lista.length
              ? `${lista.length} estabelecimento(s)`
              : `${filtrados.length} de ${lista.length} estabelecimento(s)`}
          </p>

          {filtrados.length === 0 ? (
            <div className="empty">
              <strong>Nenhum resultado</strong>
              Tente outro termo ou limpe os filtros.
            </div>
          ) : (
            <div className="cards-grid">
              {filtrados.map((estabelecimento) => {
                const temMapa =
                  typeof estabelecimento.latitude === "number" &&
                  typeof estabelecimento.longitude === "number";

                return (
                  <CardLugar
                    key={estabelecimento.id}
                    imagem={imagemEstabelecimento(estabelecimento.categoria)}
                    selo={estabelecimento.categoria}
                    titulo={estabelecimento.nome}
                    local={[estabelecimento.cidade, estabelecimento.endereco]
                      .filter(Boolean)
                      .join(" · ")}
                    descricao={estabelecimento.descricao}
                  >
                    {temMapa && (
                      <a
                        className="button ghost pequeno"
                        href={linkMapa(estabelecimento.latitude, estabelecimento.longitude)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ver ${estabelecimento.nome} no mapa (abre em nova aba)`}
                      >
                        <Icon nome="pin" tamanho={15} />
                        Ver no mapa
                      </a>
                    )}

                    {ehProfissional && (
                      <>
                        <button
                          type="button"
                          className="button edit pequeno"
                          onClick={() => handleEditar(estabelecimento)}
                          aria-label={`Editar estabelecimento ${estabelecimento.nome}`}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="button delete pequeno"
                          onClick={() => handleExcluir(estabelecimento)}
                          aria-label={`Excluir estabelecimento ${estabelecimento.nome}`}
                        >
                          Excluir
                        </button>
                      </>
                    )}
                  </CardLugar>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );

  return embutido ? <section>{conteudo}</section> : <main className="page">{conteudo}</main>;
}

export default Estabelecimentos;
