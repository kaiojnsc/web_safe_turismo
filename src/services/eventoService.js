const Evento = require('../models/Evento');
const AppError = require('../utils/AppError');

const criar = async (dados, usuarioId) => {
  const { nome, descricao, data, local } = dados;

  if (!nome || !descricao || !data || !local) {
    throw new AppError('Nome, descrição, data e local são obrigatórios', 400, 'BAD_REQUEST');
  }

  const evento = new Evento({
    nome,
    descricao,
    data,
    local,
    criadoPor: usuarioId
  });

  const eventoSalvo = await evento.save();
  return eventoSalvo.populate('criadoPor', '-senha');
};

const listar = () => Evento.find().populate('criadoPor', '-senha');

const buscarPorId = async (id) => {
  const evento = await Evento.findById(id).populate('criadoPor', '-senha');

  if (!evento) {
    throw new AppError('Evento não encontrado', 404, 'NOT_FOUND');
  }

  return evento;
};

const atualizar = async (id, dados) => {
  const { nome, descricao, data, local } = dados;

  const evento = await Evento.findByIdAndUpdate(
    id,
    { nome, descricao, data, local },
    { new: true, runValidators: true }
  ).populate('criadoPor', '-senha');

  if (!evento) {
    throw new AppError('Evento não encontrado', 404, 'NOT_FOUND');
  }

  return evento;
};

const excluir = async (id) => {
  const evento = await Evento.findByIdAndDelete(id);

  if (!evento) {
    throw new AppError('Evento não encontrado', 404, 'NOT_FOUND');
  }
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  atualizar,
  excluir
};
