const Estabelecimento = require('../models/Estabelecimento');
const AppError = require('../utils/AppError');

const criar = async (dados, usuarioId) => {
  const {
    nome,
    descricao,
    categoria,
    endereco,
    cidade,
    latitude,
    longitude
  } = dados;

  if (!nome || !descricao || !categoria || !cidade) {
    throw new AppError(
      'Nome, descrição, categoria e cidade são obrigatórios',
      400,
      'BAD_REQUEST'
    );
  }

  const estabelecimento = new Estabelecimento({
    nome,
    descricao,
    categoria,
    endereco,
    cidade,
    latitude,
    longitude,
    criadoPor: usuarioId
  });

  const estabelecimentoSalvo = await estabelecimento.save();

  return estabelecimentoSalvo.populate('criadoPor', '-senha');
};

const listar = (cidade, categoria) => {
  const filtro = {};

  if (cidade) {
    filtro.cidade = cidade;
  }

  if (categoria) {
    filtro.categoria = categoria;
  }

  return Estabelecimento.find(filtro).populate('criadoPor', '-senha');
};

const buscarPorId = async (id) => {
  const estabelecimento = await Estabelecimento.findById(id).populate(
    'criadoPor',
    '-senha'
  );

  if (!estabelecimento) {
    throw new AppError(
      'Estabelecimento não encontrado',
      404,
      'NOT_FOUND'
    );
  }

  return estabelecimento;
};

const atualizar = async (id, dados) => {
  const {
    nome,
    descricao,
    categoria,
    endereco,
    cidade,
    latitude,
    longitude
  } = dados;

  const estabelecimento = await Estabelecimento.findByIdAndUpdate(
    id,
    {
      nome,
      descricao,
      categoria,
      endereco,
      cidade,
      latitude,
      longitude
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('criadoPor', '-senha');

  if (!estabelecimento) {
    throw new AppError(
      'Estabelecimento não encontrado',
      404,
      'NOT_FOUND'
    );
  }

  return estabelecimento;
};

const excluir = async (id) => {
  const estabelecimento = await Estabelecimento.findByIdAndDelete(id);

  if (!estabelecimento) {
    throw new AppError(
      'Estabelecimento não encontrado',
      404,
      'NOT_FOUND'
    );
  }
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  atualizar,
  excluir
};