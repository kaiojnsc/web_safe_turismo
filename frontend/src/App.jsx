import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RotaProtegida from "./components/RotaProtegida";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Busca from "./pages/Busca";
import PontosTuristicos from "./pages/PontosTuristicos";
import Eventos from "./pages/Eventos";
import Estabelecimentos from "./pages/Estabelecimentos";
import MeuEstabelecimento from "./pages/MeuEstabelecimento";
import Profissional from "./pages/Profissional";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login key="comum" />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/acesso-profissional" element={<Login key="profissional" profissional />} />
        <Route path="/busca" element={<Busca />} />
        <Route path="/pontos-turisticos" element={<PontosTuristicos />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/estabelecimentos" element={<Estabelecimentos />} />

        {/* Protegidas (o backend também confere o perfil em cada operação) */}
        <Route
          path="/meu-estabelecimento"
          element={
            <RotaProtegida perfis={["instituicao"]}>
              <MeuEstabelecimento />
            </RotaProtegida>
          }
        />
        <Route
          path="/profissional"
          element={
            <RotaProtegida perfis={["profissional"]} entrada="/acesso-profissional">
              <Profissional />
            </RotaProtegida>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
