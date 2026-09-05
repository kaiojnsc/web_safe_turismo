const { GraphQLError } = require('graphql');

const AppError = require('../utils/AppError');
const usuarioService = require('../services/usuarioService');
const pontoTuristicoService = require('../services/pontoTuristicoService');
const eventoService = require('../services/eventoService');

const exigirAutenticacao = (contexto) => {
  if (!contexto.usuario) {
    throw new GraphQLError('Usuário não autenticado', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }

  return contexto.usuario;
};

const exigirProfissional = (contexto) => {
  const usuario = exigirAutenticacao(contexto);

  if (usuario.perfil !== 'profissional') {
    throw new GraphQLError('Usuário não possui permissão', {
      extensions: { code: 'FORBIDDEN' }
    });
  }

  return usuario;
};

const comErro = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    if (error instanceof AppError) {
      throw new GraphQLError(error.message, { extensions: { code: error.code } });
    }
    throw error;
  }
};

const serializarUsuario = (usuario) => {
  if (!usuario) {
    return null;
  }

  return {
    id: usuario._id.toString(),
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    createdAt: usuario.createdAt ? usuario.createdAt.toISOString() : null,
    updatedAt: usuario.updatedAt ? usuario.updatedAt.toISOString() : null
  };
};

const serializarPontoTuristico = (ponto) => {
  if (!ponto) {
    return null;
  }

  return {
    id: ponto._id.toString(),
    nome: ponto.nome,
    descricao: ponto.descricao,
    categoria: ponto.categoria,
    endereco: ponto.endereco,
    latitude: ponto.latitude,
    longitude: ponto.longitude,
    criadoPor: serializarUsuario(ponto.criadoPor),
    createdAt: ponto.createdAt ? ponto.createdAt.toISOString() : null,
    updatedAt: ponto.updatedAt ? ponto.updatedAt.toISOString() : null
  };
};

const serializarEvento = (evento) => {
  if (!evento) {
    return null;
  }

  return {
    id: evento._id.toString(),
    nome: evento.nome,
    descricao: evento.descricao,
    data: evento.data ? evento.data.toISOString() : null,
    local: evento.local,
    criadoPor: serializarUsuario(evento.criadoPor),
    createdAt: evento.createdAt ? evento.createdAt.toISOString() : null,
    updatedAt: evento.updatedAt ? evento.updatedAt.toISOString() : null
  };
};

const resolvers = {
  perfil: comErro(async (args, contexto) => {
    const usuarioToken = exigirAutenticacao(contexto);
    const usuario = await usuarioService.buscarPerfil(usuarioToken.id);
    return serializarUsuario(usuario);
  }),

  pontosTuristicos: comErro(async (args, contexto) => {
    exigirAutenticacao(contexto);
    const pontos = await pontoTuristicoService.listar();
    return pontos.map(serializarPontoTuristico);
  }),

  pontoTuristico: comErro(async ({ id }, contexto) => {
    exigirAutenticacao(contexto);
    const ponto = await pontoTuristicoService.buscarPorId(id);
    return serializarPontoTuristico(ponto);
  }),

  eventos: comErro(async (args, contexto) => {
    exigirAutenticacao(contexto);
    const eventos = await eventoService.listar();
    return eventos.map(serializarEvento);
  }),

  evento: comErro(async ({ id }, contexto) => {
    exigirAutenticacao(contexto);
    const evento = await eventoService.buscarPorId(id);
    return serializarEvento(evento);
  }),

  cadastrar: comErro(async ({ input }) => {
    const usuario = await usuarioService.cadastrar(input);
    return {
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: serializarUsuario(usuario)
    };
  }),

  login: comErro(async ({ input }) => {
    const { token, usuario } = await usuarioService.login(input);
    return {
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: serializarUsuario(usuario)
    };
  }),

  atualizarPerfil: comErro(async ({ input }, contexto) => {
    const usuarioToken = exigirAutenticacao(contexto);
    const usuario = await usuarioService.atualizarPerfil(usuarioToken.id, input);
    return {
      mensagem: 'Perfil atualizado com sucesso',
      usuario: serializarUsuario(usuario)
    };
  }),

  excluirPerfil: comErro(async (args, contexto) => {
    const usuarioToken = exigirAutenticacao(contexto);
    await usuarioService.excluirPerfil(usuarioToken.id);
    return { mensagem: 'Conta excluída com sucesso' };
  }),


  cadastrarPontoTuristico: comErro(async ({ input }, contexto) => {
    const usuario = exigirProfissional(contexto);
    const ponto = await pontoTuristicoService.criar(input, usuario.id);
    return serializarPontoTuristico(ponto);
  }),

  atualizarPontoTuristico: comErro(async ({ id, input }, contexto) => {
    exigirProfissional(contexto);
    const ponto = await pontoTuristicoService.atualizar(id, input);
    return serializarPontoTuristico(ponto);
  }),

  excluirPontoTuristico: comErro(async ({ id }, contexto) => {
    exigirProfissional(contexto);
    await pontoTuristicoService.excluir(id);
    return { mensagem: 'Ponto turístico excluído com sucesso' };
  }),

  cadastrarEvento: comErro(async ({ input }, contexto) => {
    const usuario = exigirProfissional(contexto);
    const evento = await eventoService.criar(input, usuario.id);
    return serializarEvento(evento);
  }),

  atualizarEvento: comErro(async ({ id, input }, contexto) => {
    exigirProfissional(contexto);
    const evento = await eventoService.atualizar(id, input);
    return serializarEvento(evento);
  }),

  excluirEvento: comErro(async ({ id }, contexto) => {
    exigirProfissional(contexto);
    await eventoService.excluir(id);
    return { mensagem: 'Evento excluído com sucesso' };
  })
};

module.exports = resolvers;
