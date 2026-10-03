import './Home.css';

function Home() {
  return (
    <main className="home">
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-eyebrow">Turismo com informação e segurança</span>

          <h1>
            Planeje melhor cada visita com o <span>SafeTour</span>
          </h1>

          <p className="home-hero-description">
            Consulte pontos turísticos, eventos, estabelecimentos e áreas de
            risco em um só lugar. Informações organizadas para ajudar turistas
            a conhecer novos destinos com mais tranquilidade.
          </p>
        </div>
      </section>

      <section className="home-about">
        <div className="home-section-heading">
          <span>Sobre a plataforma</span>
          <h2>Informação útil para uma experiência de turismo mais segura</h2>
        </div>

        <p>
          O SafeTour reúne informações importantes sobre diferentes pontos de
          uma cidade, facilitando o planejamento de visitas e o acesso a dados
          relevantes antes e durante o passeio.
        </p>
      </section>

      <section className="home-features">
        <div className="home-section-heading">
          <span>Recursos</span>
          <h2>O que você encontra no SafeTour</h2>
        </div>

        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-number">01</div>

            <h3>Pontos turísticos</h3>

            <p>
              Encontre lugares para visitar e consulte informações importantes
              sobre cada ponto turístico.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-number">02</div>

            <h3>Eventos</h3>

            <p>
              Acompanhe eventos disponíveis e veja o que está acontecendo na
              região durante sua visita.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-number">03</div>

            <h3>Estabelecimentos</h3>

            <p>
              Consulte serviços, comércios e locais úteis próximos aos seus
              destinos.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-number">04</div>

            <h3>Áreas de risco</h3>

            <p>
              Visualize informações sobre regiões que exigem maior atenção e
              planeje seus deslocamentos com mais segurança.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Home;