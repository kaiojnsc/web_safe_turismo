// Guarda o token e os dados do usuário logado no navegador,
// para o login continuar valendo depois de recarregar a página.
// A senha NUNCA é guardada no navegador.

const CHAVE_TOKEN = "safetour_token";
const CHAVE_USUARIO = "safetour_usuario";

export function salvarSessao(token, usuario) {
  localStorage.setItem(CHAVE_TOKEN, token);
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

// Lê a data de expiração (exp) do JWT, só para evitar mostrar a pessoa
// como "logada" com um token vencido. A validação real é feita no servidor.
function tokenExpirado(token) {
  try {
    const carga = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return !carga.exp || carga.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export function obterToken() {
  const token = localStorage.getItem(CHAVE_TOKEN);

  if (token && tokenExpirado(token)) {
    limparSessao();
    return null;
  }

  return token;
}

// Momento (em ms) em que o token atual expira, ou null se não houver sessão.
export function expiracaoToken() {
  const token = localStorage.getItem(CHAVE_TOKEN);

  if (!token) {
    return null;
  }

  try {
    const carga = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return carga.exp ? carga.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function obterUsuario() {
  if (!obterToken()) {
    return null;
  }

  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIO));
  } catch {
    return null;
  }
}

export function limparSessao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USUARIO);
}
