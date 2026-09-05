const { decodificarToken } = require('../utils/token');

const criarContexto = async (req) => {
  try {
    const usuario = decodificarToken(req.headers.authorization);
    return { usuario };
  } catch (error) {
    return { usuario: null };
  }
};

module.exports = criarContexto;
