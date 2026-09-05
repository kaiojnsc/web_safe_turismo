const PontoTuristico = require('../models/PontoTuristico');
const AppError = require('../utils/AppError');

const criar = async (dados, usuarioId) => {
  const { nome, descricao, categoria, endereco, latitude, longitude } = dados;

  if (!nome || !descricao) {
    throw new AppError('Nome e descrição são obrigatórios', 400, 'BAD_REQUEST');
  }

  const pontoTuristico = new PontoTuristico({
    nome,
    descricao,
    categoria,
    endereco,
    latitude,
    longitude,
    criadoPor: usuarioId
  });

  const pontoSalvo = await pontoTuristico.save();
  return pontoSalvo.populate('criadoPor', '-senha');
};

const listar = () => PontoTuristico.find().populate('criadoPor', '-senha');

const buscarPorId = async (id) => {
  const pontoTuristico = await PontoTuristico.findById(id).populate('criadoPor', '-senha');

  if (!pontoTuristico) {
    throw new AppError('Ponto turístico não encontrado', 404, 'NOT_FOUND');
  }

  return pontoTuristico;
};

const atualizar = async (id, dados) => {
  const { nome, descricao, categoria, endereco, latitude, longitude } = dados;

  const pontoTuristico = await PontoTuristico.findByIdAndUpdate(
    id,
    { nome, descricao, categoria, endereco, latitude, longitude },
    { new: true, runValidators: true }
  ).populate('criadoPor', '-senha');

  if (!pontoTuristico) {
    throw new AppError('Ponto turístico não encontrado', 404, 'NOT_FOUND');
  }

  return pontoTuristico;
};

const excluir = async (id) => {
  const pontoTuristico = await PontoTuristico.findByIdAndDelete(id);

  if (!pontoTuristico) {
    throw new AppError('Ponto turístico não encontrado', 404, 'NOT_FOUND');
  }
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  atualizar,
  excluir
};
