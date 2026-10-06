import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_MEU_ESTABELECIMENTO } from "../graphql/queries";
import { CREATE_ESTABELECIMENTO, UPDATE_ESTABELECIMENTO } from "../graphql/mutations";
import { imagemEstabelecimento } from "../utils/helpers";

import CardLugar from "../components/CardLugar";
import ErrorMessage from "../components/ErrorMessage";
import EstabelecimentoForm from "../components/EstabelecimentoForm";
import Loading from "../components/Loading";
import SuccessMessage from "../components/SuccessMessage";

// Área da instituição: cadastrar e editar o PRÓPRIO estabelecimento.
// Cada instituição tem no máximo um; quem é o dono vem do login (backend),
// nunca de um campo enviado por esta tela.
function MeuEstabelecimento() {
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_MEU_ESTABELECIMENTO);

  const [criar, { loading: criando }] = useMutation(CREATE_ESTABELECIMENTO);
  const [atualizar, { loading: atualizando }] = useMutation(UPDATE_ESTABELECIMENTO);

  const estabelecimento = data?.meuEstabelecimento || null;

  const handleSave = async (input) => {
    setErro("");
    setSucesso("");

    try {
      if (estabelecimento) {
        await atualizar({ variables: { id: estabelecimento.id, input } });
        setSucesso("Dados do estabelecimento atualizados.");
      } else {
        await criar({ variables: { input } });
        setSucesso("Estabelecimento cadastrado! Ele já aparece para os turistas.");
      }

      await refetch();
    } catch (falha) {
      setErro(falha.message);
    }
  };

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Área da instituição</span>
          <h1>Meu estabelecimento</h1>
          <p className="page-subtitulo">
            {estabelecimento
              ? "Mantenha os dados atualizados para os turistas encontrarem você."
              : "Cadastre seu estabelecimento para ele aparecer no SafeTour."}
          </p>
        </div>

        <Link to="/estabelecimentos" className="button ghost">
          Ver página pública
        </Link>
      </div>

      <SuccessMessage message={sucesso} />
      <ErrorMessage message={erro} />

      {loading && !data && <Loading />}
      <ErrorMessage message={error && !data ? error.message : ""} />

      {data && (
        <div className="meu-estab-grid">
          <EstabelecimentoForm
            estabelecimento={estabelecimento}
            onSave={handleSave}
            salvando={criando || atualizando}
            rotuloSalvar={estabelecimento ? "Salvar alterações" : "Cadastrar estabelecimento"}
          />

          <aside className="meu-estab-previa" aria-label="Como os turistas veem seu estabelecimento">
            <h2>Como aparece para os turistas</h2>

            {estabelecimento ? (
              <CardLugar
                imagem={imagemEstabelecimento(estabelecimento.categoria)}
                selo={estabelecimento.categoria}
                titulo={estabelecimento.nome}
                local={[estabelecimento.cidade, estabelecimento.endereco].filter(Boolean).join(" · ")}
                descricao={estabelecimento.descricao}
              />
            ) : (
              <div className="empty">
                <strong>Ainda sem estabelecimento</strong>
                Preencha o formulário ao lado e salve para ver a prévia aqui.
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}

export default MeuEstabelecimento;
