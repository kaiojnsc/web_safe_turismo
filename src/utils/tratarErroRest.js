const AppError = require('./AppError');

const tratarErroRest = (res, error, mensagemPadrao) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ mensagem: error.message });
  }

  return res.status(500).json({ mensagem: mensagemPadrao, erro: error.message });
};

module.exports = tratarErroRest;
