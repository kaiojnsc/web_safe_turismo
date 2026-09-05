const { decodificarToken } = require('../utils/token');

const autenticar = (req, res, next) => {
  try {
    req.usuario = decodificarToken(req.headers.authorization);
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
