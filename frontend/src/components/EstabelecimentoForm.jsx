import { useEffect, useState } from "react";

import ErrorMessage from "./ErrorMessage";
import Icon from "./Icon";

const CATEGORIAS_SUGERIDAS = [
  "Restaurante",
  "Hospedagem",
  "Cafeteria",
  "Bar",
  "Passeios e turismo",
  "Comércio",
  "Lazer",
];

const doRegistro = (estabelecimento) => ({
  nome: estabelecimento?.nome || "",
  descricao: estabelecimento?.descricao || "",
  categoria: estabelecimento?.categoria || "",
  endereco: estabelecimento?.endereco || "",
  cidade: estabelecimento?.cidade || "",
  latitude: estabelecimento?.latitude ?? "",
  longitude: estabelecimento?.longitude ?? "",
});

const MENSAGENS_GEOLOCALIZACAO = {
  1: "Permissão de localização negada. Você pode preencher latitude e longitude manualmente.",
  2: "Não foi possível descobrir sua localização agora. Preencha latitude e longitude manualmente.",
  3: "A busca pela localização demorou demais. Tente novamente ou preencha manualmente.",
};

// Mesmo formulário para CADASTRAR (estabelecimento = null) e EDITAR.
// Usado em "Meu estabelecimento" (instituição) e no painel profissional.
// O dono do estabelecimento nunca é enviado: o backend usa o usuário logado.
function EstabelecimentoForm({
  estabelecimento,
  onSave,
  onCancel,
  salvando = false,
  rotuloSalvar = "Salvar",
}) {
  const [campos, setCampos] = useState(doRegistro(estabelecimento));
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [localizando, setLocalizando] = useState(false);

  // Troca de registro (ex.: editar outro estabelecimento) recarrega os campos.
  const idAtual = estabelecimento?.id;
  useEffect(() => {
    setCampos(doRegistro(estabelecimento));
    setErro("");
    setAviso("");
  }, [idAtual]);

  const alterar = (campo) => (event) =>
    setCampos((anteriores) => ({ ...anteriores, [campo]: event.target.value }));

  const usarMinhaLocalizacao = () => {
    setErro("");
    setAviso("");

    if (!("geolocation" in navigator)) {
      setAviso("Seu navegador não oferece geolocalização. Preencha latitude e longitude manualmente.");
      return;
    }

    setLocalizando(true);

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        setCampos((anteriores) => ({
          ...anteriores,
          latitude: Number(posicao.coords.latitude.toFixed(6)),
          longitude: Number(posicao.coords.longitude.toFixed(6)),
        }));
        setAviso("Localização preenchida. Confira os valores antes de salvar.");
        setLocalizando(false);
      },
      (falha) => {
        setAviso(
          MENSAGENS_GEOLOCALIZACAO[falha.code] ||
            "Não foi possível obter a localização. Preencha manualmente."
        );
        setLocalizando(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  };

  const lerCoordenada = (valor, nome, minimo, maximo) => {
    if (valor === "" || valor === null || valor === undefined) {
      return undefined;
    }

    const numero = Number(String(valor).replace(",", "."));

    if (!Number.isFinite(numero) || numero < minimo || numero > maximo) {
      throw new Error(`${nome} deve ser um número entre ${minimo} e ${maximo}.`);
    }

    return numero;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErro("");

    let latitude;
    let longitude;

    try {
      latitude = lerCoordenada(campos.latitude, "Latitude", -90, 90);
      longitude = lerCoordenada(campos.longitude, "Longitude", -180, 180);
    } catch (falha) {
      setErro(falha.message);
      return;
    }

    if ((latitude === undefined) !== (longitude === undefined)) {
      setErro("Informe latitude e longitude juntas, ou deixe as duas em branco.");
      return;
    }

    const input = {
      nome: campos.nome.trim(),
      descricao: campos.descricao.trim(),
      categoria: campos.categoria.trim(),
      endereco: campos.endereco.trim(),
      cidade: campos.cidade.trim(),
    };

    if (latitude !== undefined) {
      input.latitude = latitude;
      input.longitude = longitude;
    }

    onSave(input);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{estabelecimento ? "Editar estabelecimento" : "Cadastrar estabelecimento"}</h2>

      <ErrorMessage message={erro} />

      <div className="form-group">
        <label htmlFor="est-nome">Nome *</label>
        <input id="est-nome" type="text" value={campos.nome} onChange={alterar("nome")} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="est-categoria">Categoria *</label>
          <input
            id="est-categoria"
            type="text"
            list="est-categorias"
            placeholder="Ex.: Restaurante, Hospedagem"
            value={campos.categoria}
            onChange={alterar("categoria")}
            required
          />
          <datalist id="est-categorias">
            {CATEGORIAS_SUGERIDAS.map((categoria) => (
              <option key={categoria} value={categoria} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label htmlFor="est-cidade">Cidade *</label>
          <input
            id="est-cidade"
            type="text"
            autoComplete="address-level2"
            value={campos.cidade}
            onChange={alterar("cidade")}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="est-descricao">Descrição *</label>
        <textarea
          id="est-descricao"
          value={campos.descricao}
          onChange={alterar("descricao")}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="est-endereco">Endereço</label>
        <input
          id="est-endereco"
          type="text"
          autoComplete="street-address"
          placeholder="Rua, número, bairro"
          value={campos.endereco}
          onChange={alterar("endereco")}
        />
      </div>

      <fieldset className="localizacao">
        <legend>Localização no mapa (opcional)</legend>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="est-latitude">Latitude</label>
            <input
              id="est-latitude"
              type="number"
              step="any"
              min="-90"
              max="90"
              placeholder="-7.230000"
              value={campos.latitude}
              onChange={alterar("latitude")}
            />
          </div>

          <div className="form-group">
            <label htmlFor="est-longitude">Longitude</label>
            <input
              id="est-longitude"
              type="number"
              step="any"
              min="-180"
              max="180"
              placeholder="-35.880000"
              value={campos.longitude}
              onChange={alterar("longitude")}
            />
          </div>
        </div>

        <button
          type="button"
          className="button ghost"
          onClick={usarMinhaLocalizacao}
          disabled={localizando}
        >
          <Icon nome="alvo" tamanho={18} />
          {localizando ? "Buscando localização..." : "Usar minha localização"}
        </button>

        {aviso && (
          <p className="aviso-localizacao" role="status">
            {aviso}
          </p>
        )}
      </fieldset>

      <div className="form-buttons">
        <button type="submit" className="button save" disabled={salvando}>
          {salvando ? "Salvando..." : rotuloSalvar}
        </button>
        {onCancel && (
          <button type="button" className="button cancel" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default EstabelecimentoForm;
