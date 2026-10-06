const Estabelecimento = require('../models/Estabelecimento');
const AppError = require('../utils/AppError');

const POPULAR = ['criadoPor', '-senha'];

// Usuário vem do token JWT: { id, perfil }.
const ehProfissional = (usuario) => usuario && usuario.perfil === 'profissional';

const converterCoordenada = (valor, nome, minimo, maximo) => {
  if (valor === undefined || valor === null || valor === '') {
    return undefined;
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < minimo || numero > maximo) {
    throw new AppError(`${nome} inválida`, 400, 'BAD_REQUEST');
  }

  return numero;
};

const limparTexto = (valor) => (typeof valor === 'string' ? valor.trim() : valor);

const criar = async (dados, usuario) => {
  const { nome, descricao, categoria, endereco, cidade, latitude, longitude } = dados;

  if (!limparTexto(nome) || !limparTexto(descricao) || !limparTexto(categoria) || !limparTexto(cidade)) {
    throw new AppError(
      'Nome, descrição, categoria e cidade são obrigatórios',
      400,
      'BAD_REQUEST'
    );
  }

  // Cada instituição possui um único estabelecimento associado à conta.
  if (usuario.perfil === 'instituicao') {
    const existente = await Estabelecimento.findOne({ criadoPor: usuario.id });

    if (existente) {
      throw new AppError(
        'Sua conta já possui um estabelecimento cadastrado. Edite o existente.',
        409,
        'CONFLICT'
      );
    }
  }

  const estabelecimento = new Estabelecimento({
    nome: limparTexto(nome),
    descricao: limparTexto(descricao),
    categoria: limparTexto(categoria),
    endereco: limparTexto(endereco),
    cidade: limparTexto(cidade),
    latitude: converterCoordenada(latitude, 'Latitude', -90, 90),
    longitude: converterCoordenada(longitude, 'Longitude', -180, 180),
    criadoPor: usuario.id
  });

  const salvo = await estabelecimento.save();

  // Proteção extra contra requisições simultâneas: se a instituição acabou com
  // mais de um registro, só o mais antigo permanece; este (se não for o mais
  // antigo) é desfeito e a requisição recusada.
  if (usuario.perfil === 'instituicao') {
    const maisAntigo = await Estabelecimento.findOne({ criadoPor: usuario.id })
      .sort({ _id: 1 })
      .select('_id');

    if (maisAntigo && String(maisAntigo._id) !== String(salvo._id)) {
      await Estabelecimento.deleteOne({ _id: salvo._id });
      throw new AppError(
        'Sua conta já possui um estabelecimento cadastrado. Edite o existente.',
        409,
        'CONFLICT'
      );
    }
  }

  return salvo.populate(...POPULAR);
};

const listar = (cidade, categoria) => {
  const filtro = {};

  if (cidade) {
    filtro.cidade = cidade;
  }

  if (categoria) {
    filtro.categoria = categoria;
  }

  return Estabelecimento.find(filtro).sort({ nome: 1 }).populate(...POPULAR);
};

const buscarPorId = async (id) => {
  const estabelecimento = await Estabelecimento.findById(id).populate(...POPULAR);

  if (!estabelecimento) {
    throw new AppError('Estabelecimento não encontrado', 404, 'NOT_FOUND');
  }

  return estabelecimento;
};

// Estabelecimento da instituição autenticada (ou null se ainda não cadastrou).
const buscarDoUsuario = (usuarioId) =>
  Estabelecimento.findOne({ criadoPor: usuarioId }).populate(...POPULAR);

// Regra de propriedade (validada no servidor):
// profissional edita qualquer um; instituição só o que ela criou.
const atualizar = async (id, dados, usuario) => {
  const atual = await Estabelecimento.findById(id);

  if (!atual) {
    throw new AppError('Estabelecimento não encontrado', 404, 'NOT_FOUND');
  }

  if (!ehProfissional(usuario) && String(atual.criadoPor) !== String(usuario.id)) {
    throw new AppError(
      'Você só pode editar o seu próprio estabelecimento',
      403,
      'FORBIDDEN'
    );
  }

  const { nome, descricao, categoria, endereco, cidade, latitude, longitude } = dados;

  const campos = {
    nome: limparTexto(nome),
    descricao: limparTexto(descricao),
    categoria: limparTexto(categoria),
    endereco: limparTexto(endereco),
    cidade: limparTexto(cidade),
    latitude: converterCoordenada(latitude, 'Latitude', -90, 90),
    longitude: converterCoordenada(longitude, 'Longitude', -180, 180)
  };

  // Campos obrigatórios não podem ficar vazios.
  ['nome', 'descricao', 'categoria', 'cidade'].forEach((campo) => {
    if (campos[campo] !== undefined && !campos[campo]) {
      throw new AppError(`O campo ${campo} não pode ficar vazio`, 400, 'BAD_REQUEST');
    }
  });

  // criadoPor nunca é alterado por esta rota.
  return Estabelecimento.findByIdAndUpdate(id, campos, {
    new: true,
    runValidators: true
  }).populate(...POPULAR);
};

const excluir = async (id) => {
  const estabelecimento = await Estabelecimento.findByIdAndDelete(id);

  if (!estabelecimento) {
    throw new AppError('Estabelecimento não encontrado', 404, 'NOT_FOUND');
  }
};

module.exports = {
  criar,
  listar,
  buscarPorId,
  buscarDoUsuario,
  atualizar,
  excluir
};