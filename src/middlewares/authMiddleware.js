const { decodificarToken } = require('../utils/token');
const usuarioService = require('../services/usuarioService');

const autenticar = async (req, res, next) => {
  try {
    const dadosToken = decodificarToken(req.headers.authorization);
    const usuario = await usuarioService.buscarIdentidade(dadosToken.id);

    if (!usuario) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(error.statusCode || 401).json({
      mensagem: error.message
    });
  }
};

const autorizar = (...perfisPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        mensagem: 'Usuário não autenticado'
      });
    }

    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({
        mensagem: 'Usuário não possui permissão'
      });
    }

    next();
  };
};

module.exports = {
  autenticar,
  autorizar
};
