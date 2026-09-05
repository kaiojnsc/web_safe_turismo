const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

const gerarToken = (usuario) =>
  jwt.sign(
    {
      id: usuario._id.toString(),
      email: usuario.email,
      perfil: usuario.perfil
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

const decodificarToken = (authorization) => {
  if (!authorization) {
    throw new AppError('Token não informado', 401, 'UNAUTHENTICATED');
  }

  const partes = authorization.split(' ');

  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    throw new AppError('Token deve utilizar Bearer', 401, 'UNAUTHENTICATED');
  }

  try {
    return jwt.verify(partes[1], process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError('Token inválido ou expirado', 401, 'UNAUTHENTICATED');
  }
};

module.exports = { gerarToken, decodificarToken };
