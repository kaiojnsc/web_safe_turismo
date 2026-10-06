const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const Estabelecimento = require('../models/Estabelecimento');
const AppError = require('../utils/AppError');
const { gerarToken } = require('../utils/token');

// Perfis que uma pessoa pode escolher no cadastro público.
// "profissional" (administrador) NUNCA é criado por aqui.
const PERFIS_CADASTRO_PUBLICO = ['turista', 'instituicao'];
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cadastrar = async ({ nome, email, senha, perfil }) => {
  if (
    typeof nome !== 'string' || !nome.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof senha !== 'string' || !senha
  ) {
    throw new AppError('Nome, email e senha são obrigatórios', 400, 'BAD_REQUEST');
  }

  if (!REGEX_EMAIL.test(email.trim())) {
    throw new AppError('Email inválido', 400, 'BAD_REQUEST');
  }

  if (senha.length < 6) {
    throw new AppError('A senha deve ter pelo menos 6 caracteres', 400, 'BAD_REQUEST');
  }

  const perfilEscolhido = perfil === undefined || perfil === null || perfil === '' ? 'turista' : perfil;

  if (perfilEscolhido === 'profissional') {
    throw new AppError(
      'Não é possível criar uma conta profissional pelo cadastro público',
      403,
      'FORBIDDEN'
    );
  }

  if (!PERFIS_CADASTRO_PUBLICO.includes(perfilEscolhido)) {
    throw new AppError('Tipo de conta inválido. Use turista ou instituicao', 400, 'BAD_REQUEST');
  }

  const emailNormalizado = email.trim().toLowerCase();
  const usuarioExistente = await Usuario.findOne({ email: emailNormalizado });

  if (usuarioExistente) {
    throw new AppError('Email já cadastrado', 409, 'CONFLICT');
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const usuario = new Usuario({
    nome: nome.trim(),
    email: emailNormalizado,
    senha: senhaCriptografada,
    perfil: perfilEscolhido
  });

  return usuario.save();
};

// modo:
//   'comum'        -> login de turista/instituição (profissional é orientado ao acesso profissional)
//   'profissional' -> só entra quem tem perfil === 'profissional'
//   undefined      -> sem restrição (API REST existente)
const login = async ({ email, senha }, modo) => {
  if (typeof email !== 'string' || typeof senha !== 'string') {
    throw new AppError('Email ou senha inválidos', 401, 'UNAUTHENTICATED');
  }

  const usuario = await Usuario.findOne({ email: email.trim().toLowerCase() }).select('+senha');

  if (!usuario) {
    throw new AppError('Email ou senha inválidos', 401, 'UNAUTHENTICATED');
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    throw new AppError('Email ou senha inválidos', 401, 'UNAUTHENTICATED');
  }

  if (modo === 'profissional' && usuario.perfil !== 'profissional') {
    throw new AppError('Esta conta não possui acesso profissional', 403, 'FORBIDDEN');
  }

  if (modo === 'comum' && usuario.perfil === 'profissional') {
    throw new AppError('Contas profissionais devem entrar pelo Acesso profissional', 403, 'FORBIDDEN');
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

// Identidade confirmada no banco: o perfil vale o que está gravado agora,
// não o que estava no token. Conta excluída => token deixa de valer.
const buscarIdentidade = async (usuarioId) => {
  const usuario = await Usuario.findById(usuarioId).select('email perfil');

  if (!usuario) {
    return null;
  }

  return { id: usuario._id.toString(), email: usuario.email, perfil: usuario.perfil };
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

// Estratégia segura de exclusão:
// - Pontos turísticos e eventos são conteúdo da plataforma e NUNCA são apagados
//   junto com a conta de quem os cadastrou.
// - Só o estabelecimento da própria instituição (que representa a conta) é removido.
// - Contas profissionais (administração global) não se excluem sozinhas.
const excluirPerfil = async (usuarioId) => {
  const usuario = await Usuario.findById(usuarioId);

  if (!usuario) {
    throw new AppError('Usuário não encontrado', 404, 'NOT_FOUND');
  }

  if (usuario.perfil === 'profissional') {
    throw new AppError(
      'Contas profissionais não podem ser excluídas por aqui. Use o procedimento administrativo.',
      403,
      'FORBIDDEN'
    );
  }

  if (usuario.perfil === 'instituicao') {
    await Estabelecimento.deleteMany({ criadoPor: usuario._id });
  }

  await usuario.deleteOne();
};

module.exports = {
  cadastrar,
  login,
  buscarPerfil,
  buscarIdentidade,
  atualizarPerfil,
  excluirPerfil
};
