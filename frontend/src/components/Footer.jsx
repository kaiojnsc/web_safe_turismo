import "./Footer.css";

// Rodapé exibido em todas as páginas (antes ficava só na Home).
function Footer() {
  return (
    <footer className="rodape">
      <div className="container rodape-conteudo">
        <strong>SafeTour</strong>
        <span>Turismo com informação e segurança.</span>
      </div>
    </footer>
  );
}

export default Footer;
