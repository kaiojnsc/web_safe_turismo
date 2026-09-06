const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const Evento = require('../models/Evento');
const PontoTuristico = require('../models/PontoTuristico');
const AppError = require('../utils/AppError');
const { gerarToken } = require('../utils/token');

const cadastrar = async ({ nome, email, senha, perfil }) => {
  if (
    typeof nome !== 'string' || !nome ||
    typeof email !== 'string' || !email ||
    typeof senha !== 'string' || !senha
  ) {
    throw new AppError('Nome, email e senha são obrigatórios', 400, 'BAD_REQUEST');
  }

  const usuarioExistente = await Usuario.findOne({ email: email.toLowerCase() });

  if (usuarioExistente) {
    throw new AppError('Email já cadastrado', 409, 'CONFLICT');
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const usuario = new Usuario({
    nome,
    email: email.toLowerCase(),
    senha: senhaCriptografada,
    perfil: perfil === 'profissional' ? 'profissional' : 'turista'
  });

  return usuario.save();
};

const login = async ({ email, senha }) => {
  if (typeof email !== 'string' || typeof senha !== 'string') {
    throw new AppError('Email ou senha inválidos', 401, 'UNAUTHENTICATED');
  }

  const usuario = await Usuario.findOne({ email: email.toLowerCase() }).select('+senha');

  if (!usuario) {
    throw new AppError('Email ou senha inválidos', 401, 'UNAUTHENTICATED');
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    throw new AppError('Email ou senha inválidos', 401, 'UNAUTHENTICATED');
  }

  return { token: gerarToken(usuario), usuario };
};

const buscarPerfil = async (usuarioId) => {
  const usuario = await Usuario.findById(usuarioId);

  if (!usuario) {
    throw new AppError('Usuário não encontrado', 404, 'NOT_FOUND');
  }

  return usuario;
};

const atualizarPerfil = async (usuarioId, { nome, email, senha }) => {
  if (
    (nome !== undefined && typeof nome !== 'string') ||
    (email !== undefined && typeof email !== 'string') ||
    (senha !== undefined && typeof senha !== 'string')
  ) {
    throw new AppError('Nome, email e senha devem ser texto', 400, 'BAD_REQUEST');
  }

  const usuario = await Usuario.findById(usuarioId);

  if (!usuario) {
    throw new AppError('Usuário não encontrado', 404, 'NOT_FOUND');
  }

  if (email && email !== usuario.email) {
    const emailEmUso = await Usuario.findOne({ email: email.toLowerCase() });

    if (emailEmUso) {
      throw new AppError('Email já cadastrado', 409, 'CONFLICT');
    }

    usuario.email = email.toLowerCase();
  }

  if (nome) {
    usuario.nome = nome;
  }

  if (senha) {
    usuario.senha = await bcrypt.hash(senha, 10);
  }

  return usuario.save();
};

const excluirPerfil = async (usuarioId) => {
  const usuario = await Usuario.findById(usuarioId);

  if (!usuario) {
    throw new AppError('Usuário não encontrado', 404, 'NOT_FOUND');
  }

  // Mantém a integridade das relações: os documentos criados pelo usuário
  // deixam de existir quando a conta é excluída.
  await Promise.all([
    Evento.deleteMany({ criadoPor: usuario._id }),
    PontoTuristico.deleteMany({ criadoPor: usuario._id }),
    usuario.deleteOne()
  ]);
};

module.exports = {
  cadastrar,
  login,
  buscarPerfil,
  atualizarPerfil,
  excluirPerfil
};
