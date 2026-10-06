const { decodificarToken } = require('../utils/token');
const usuarioService = require('../services/usuarioService');

// A identidade vem do JWT (assinatura válida), mas o perfil usado nas
// autorizações é o gravado no banco. Assim, contas excluídas ou com perfil
// alterado perdem o acesso imediatamente, sem esperar o token expirar.
const criarContexto = async (req) => {
  try {
    const dadosToken = decodificarToken(req.headers.authorization);
    const usuario = await usuarioService.buscarIdentidade(dadosToken.id);
    return { usuario };
  } catch (error) {
    return { usuario: null };
  }
};

module.exports = criarContexto;
