const AreaDeRisco = require('../models/AreaDeRisco');
const AppError = require('../utils/AppError');

const criar = async (dados, usuarioId) => {
  const {
    cidade,
    regiao,
    nivel,
    descricao,
    latitude,
    longitude
  } = dados;

  if (!cidade || !nivel || !descricao) {
    throw new AppError(
      'Cidade, nível e descrição são obrigatórios',
      400,
      'BAD_REQUEST'
    );
  }

  const areaDeRisco = new AreaDeRisco({
    cidade,
    regiao,
    nivel,
    descricao,
    latitude,
    longitude,
    criadoPor: usuarioId
  });

  const areaSalva = await areaDeRisco.save();

  return areaSalva.populate('criadoPor', '-senha');
};

const listar = (cidade) => {
  const filtro = {};

  if (cidade) {
    filtro.cidade = cidade;
  }

  return AreaDeRisco.find(filtro).populate('criadoPor', '-senha');
};

const buscarPorId = async (id) => {
  const areaDeRisco = await AreaDeRisco.findById(id).populate(
    'criadoPor',
    '-senha'
  );

  if (!areaDeRisco) {
    throw new AppError(
      'Área de risco não encontrada',
      404,
      'NOT_FOUND'
    );
  }

  return areaDeRisco;
};

const atualizar = async (id, dados) => {
  const {
    cidade,
    regiao,
    nivel,
    descricao,
    latitude,
    longitude
  } = dados;

  const areaDeRisco = await AreaDeRisco.findByIdAndUpdate(
    id,
    {
      cidade,
      regiao,
      nivel,
      descricao,
      latitude,
      longitude
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('criadoPor', '-senha');

  if (!areaDeRisco) {
    throw new AppError(
      'Área de risco não encontrada',
      404,
      'NOT_FOUND'
    );
  }

  return areaDeRisco;
};

const excluir = async (id) => {
  const areaDeRisco = await AreaDeRisco.findByIdAndDelete(id);

  if (!areaDeRisco) {
    throw new AppError(
      'Área de risco não encontrada',
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