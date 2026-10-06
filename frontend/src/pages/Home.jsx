import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";

import { useAuth } from "../context/AuthContext";

import { GET_AREAS_RISCO, GET_DESCOBERTA } from "../graphql/queries";
import {
  IMG_EVENTO,
  IMG_HERO,
  IMG_PONTO,
  IMG_SEGURANCA,
  formatarData,
  imagemEstabelecimento,
  unicos,
  valorData,
} from "../utils/helpers";

import BuscaHero from "../components/BuscaHero";
import CardLugar from "../components/CardLugar";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import RiscoSelect from "../components/RiscoSelect";
import "./Home.css";

function SecaoTitulo({ eyebrow, titulo, link, rotuloLink }) {
  return (
    <div className="secao-titulo">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{titulo}</h2>
      </div>
      {link && (
        <Link to={link} className="secao-link">
          {rotuloLink}
          <Icon nome="seta" tamanho={18} />
        </Link>
      )}
    </div>
  );
}

function Home() {
  const { usuario } = useAuth();
  const { loading, error, data } = useQuery(GET_DESCOBERTA);
  const { data: dadosRisco } = useQuery(GET_AREAS_RISCO);

  const pontos = data?.pontosTuristicos || [];
  const eventos = data?.eventos || [];
  const estabelecimentos = data?.estabelecimentos || [];
  const areas = dadosRisco?.areasDeRisco || [];

  // Próximos eventos primeiro
  const proximosEventos = [...eventos].sort((a, b) => valorData(a.data) - valorData(b.data));

  // "Onde visitar": cidades dos estabelecimentos e das áreas cadastradas
  const cidades = unicos([...estabelecimentos.map((e) => e.cidade), ...areas.map((a) => a.cidade)]);

  return (
    <main className="home">
      <section className="home-hero">
        <h1>Para onde você vai?</h1>
        <BuscaHero />
      </section>

      <section className="container">
        <div className="home-banner">
          <div className="home-banner-imagem">
            <img src={IMG_HERO} alt="Praia com mar azul-turquesa ao entardecer" />
          </div>

          <div className="home-banner-texto">
            <h2>Descubra lugares incríveis e viaje com segurança</h2>
            <p>
              Pontos turísticos, eventos e estabelecimentos reunidos em um só lugar, com
              informações de risco para você planejar cada passeio com tranquilidade.
            </p>
            <div className="home-banner-botoes">
              <Link to="/pontos-turisticos" className="button grande">
                Explorar destinos
              </Link>
              {!usuario && (
                <Link to="/cadastro" className="button grande ghost">
                  Criar conta grátis
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {loading && <Loading />}
      {error && (
        <div className="container">
          <ErrorMessage message={`Não foi possível carregar os dados: ${error.message}`} />
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="container home-secao">
            <SecaoTitulo
              eyebrow="Descubra lugares"
              titulo="Pontos turísticos em destaque"
              link="/pontos-turisticos"
              rotuloLink="Ver todos"
            />

            {pontos.length === 0 ? (
              <div className="empty">
                <strong>Ainda não há pontos turísticos</strong>
                Assim que forem cadastrados eles aparecem aqui.
              </div>
            ) : (
              <div className="cards-grid">
                {pontos.slice(0, 3).map((ponto) => (
                  <CardLugar
                    key={ponto.id}
                    imagem={IMG_PONTO}
                    selo={ponto.categoria || "Ponto turístico"}
                    risco={<RiscoSelect valor={ponto.nivelRisco} />}
                    titulo={ponto.nome}
                    local={ponto.endereco}
                    descricao={ponto.descricao}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="container home-secao">
            <SecaoTitulo
              eyebrow="Agenda"
              titulo="Eventos para não perder"
              link="/eventos"
              rotuloLink="Ver agenda"
            />

            {proximosEventos.length === 0 ? (
              <div className="empty">
                <strong>Nenhum evento por enquanto</strong>
                Volte em breve para conferir a agenda.
              </div>
            ) : (
              <div className="cards-grid">
                {proximosEventos.slice(0, 3).map((evento) => (
                  <CardLugar
                    key={evento.id}
                    imagem={IMG_EVENTO}
                    selo={formatarData(evento.data)}
                    risco={<RiscoSelect valor={evento.nivelRisco} />}
                    titulo={evento.nome}
                    local={evento.local}
                    descricao={evento.descricao}
                  />
                ))}
              </div>
            )}
          </section>

          {cidades.length > 0 && (
            <section className="container home-secao">
              <SecaoTitulo eyebrow="Onde visitar" titulo="Explore por cidade" />

              <div className="cidades">
                {cidades.map((cidade) => (
                  <Link key={cidade} to={`/busca?q=${encodeURIComponent(cidade)}`} className="cidade-chip">
                    <Icon nome="pin" tamanho={18} />
                    {cidade}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="container home-secao">
            <SecaoTitulo
              eyebrow="Para comer e se hospedar"
              titulo="Estabelecimentos"
              link="/estabelecimentos"
              rotuloLink="Ver todos"
            />

            {estabelecimentos.length === 0 ? (
              <div className="empty">
                <strong>Nenhum estabelecimento cadastrado</strong>
                Instituições podem criar uma conta e divulgar seu espaço no SafeTour.
              </div>
            ) : (
              <div className="cards-grid">
                {estabelecimentos.slice(0, 3).map((estab) => (
                  <CardLugar
                    key={estab.id}
                    imagem={imagemEstabelecimento(estab.categoria)}
                    selo={estab.categoria}
                    titulo={estab.nome}
                    local={[estab.cidade, estab.endereco].filter(Boolean).join(" · ")}
                    descricao={estab.descricao}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <section className="container home-secao">
        <div className="home-seguranca">
          <div className="home-seguranca-texto">
            <span className="eyebrow">Turismo com segurança</span>
            <h2>Informação para decidir com confiança</h2>
            <p>
              Cada ponto turístico e evento recebe um nível de risco definido por profissionais
              do SafeTour. Consulte antes de sair e aproveite mais o seu destino.
            </p>

            <ul className="legenda-risco">
              <li>
                <RiscoSelect valor="baixo" /> Tranquilo para visitar
              </li>
              <li>
                <RiscoSelect valor="medio" /> Atenção redobrada
              </li>
              <li>
                <RiscoSelect valor="alto" /> Evite ou vá acompanhado
              </li>
            </ul>

            {areas.length > 0 && (
              <div className="areas-risco">
                <h3>Áreas monitoradas</h3>
                <ul>
                  {areas.slice(0, 4).map((area) => (
                    <li key={area.id}>
                      <RiscoSelect valor={area.nivel} />
                      <span>
                        <strong>{area.cidade}</strong>
                        {area.regiao ? ` · ${area.regiao}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="home-seguranca-imagem">
            <img src={IMG_SEGURANCA} alt="Casal caminhando em uma trilha com vista para as montanhas" loading="lazy" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;