import './Home.css';

function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>🌍 SafeTour</h1>
        <p className="home-subtitle">
          Plataforma de turismo seguro e informativo
        </p>
      </header>

      <section className="home-about">
        <p>
          O <strong>SafeTour</strong> é uma aplicação voltada para o turismo,
          permitindo o cadastro e a consulta de pontos turísticos, eventos,
          estabelecimentos e áreas de risco. O objetivo é oferecer ao turista
          informações confiáveis para planejar suas visitas com segurança.
        </p>
      </section>

      <section className="home-features">
        <h2>Funcionalidades</h2>
        <ul>
          <li>📍 Pontos Turísticos — descubra os melhores lugares para visitar</li>
          <li>📅 Eventos — fique por dentro do que está acontecendo</li>
          <li>🏪 Estabelecimentos — encontre serviços e comércios locais</li>
          <li>⚠️ Áreas de Risco — viaje com mais segurança</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
