// Funções de apoio para texto, imagens e categorias.

// Deixa o texto sem acento e em minúsculas para a busca
// encontrar "sao joao" em "São João".
export const normalizar = (texto) =>
  (texto || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

// Retorna true se QUALQUER campo contém todas as palavras do termo.
export function combinaBusca(campos, termo) {
  const palavras = normalizar(termo).split(/\s+/).filter(Boolean);

  if (palavras.length === 0) {
    return true;
  }

  const texto = campos.map(normalizar).join(" ");
  return palavras.every((palavra) => texto.includes(palavra));
}

export const IMG_HERO = "/img/hero.jpg";
export const IMG_PONTO = "/img/pontos.jpg";
export const IMG_EVENTO = "/img/eventos.jpg";
export const IMG_SEGURANCA = "/img/seguranca.jpg";

// Escolhe a foto do estabelecimento pela categoria.
export function imagemEstabelecimento(categoria) {
  return /hosped|hotel|pousada|hostel|resort|acomoda/.test(normalizar(categoria))
    ? "/img/hospedagem.jpg"
    : "/img/restaurante.jpg";
}

// Mostra a data no formato brasileiro (24/06/2026).
// timeZone "UTC" evita a data aparecer um dia antes por causa do fuso.
// O backend pode devolver a data como texto ISO ou como número em texto.
export function formatarData(data) {
  if (!data) {
    return "-";
  }

  const valor = /^\d+$/.test(String(data)) ? Number(data) : data;
  const convertida = new Date(valor);

  if (Number.isNaN(convertida.getTime())) {
    return "-";
  }

  return convertida.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function valorData(data) {
  if (!data) {
    return Number.MAX_SAFE_INTEGER;
  }

  const valor = /^\d+$/.test(String(data)) ? Number(data) : data;
  const tempo = new Date(valor).getTime();

  return Number.isNaN(tempo) ? Number.MAX_SAFE_INTEGER : tempo;
}

export const unicos = (lista) =>
  [...new Set(lista.map((item) => (item || "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );
