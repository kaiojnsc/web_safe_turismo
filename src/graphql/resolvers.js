const { GraphQLError } = require('graphql');

const AppError = require('../utils/AppError');
const usuarioService = require('../services/usuarioService');
const pontoTuristicoService = require('../services/pontoTuristicoService');
const eventoService = require('../services/eventoService');
const estabelecimentoService = require('../services/estabelecimentoService');
const areaDeRiscoService = require('../services/areaDeRiscoService');

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

// Versão pública do usuário que cadastrou um registro: sem e-mail.
const serializarAutor = (usuario) => {
  if (!usuario || !usuario._id) {
    return null;
  }

  return {
    id: usuario._id.toString(),
    nome: usuario.nome,
    perfil: usuario.perfil
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
    nivelRisco: ponto.nivelRisco || 'baixo',
    criadoPor: serializarAutor(ponto.criadoPor),
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
    nivelRisco: evento.nivelRisco || 'baixo',
    criadoPor: serializarAutor(evento.criadoPor),
    createdAt: evento.createdAt ? evento.createdAt.toISOString() : null,
    updatedAt: evento.updatedAt ? evento.updatedAt.toISOString() : null
  };
};

const serializarEstabelecimento = (estabelecimento) => {
  if (!estabelecimento) {
    return null;
  }

  return {
    id: estabelecimento._id.toString(),
    nome: estabelecimento.nome,
    descricao: estabelecimento.descricao,
    categoria: estabelecimento.categoria,
    endereco: estabelecimento.endereco,
    cidade: estabelecimento.cidade,
    latitude: estabelecimento.latitude,
    longitude: estabelecimento.longitude,
    criadoPor: serializarAutor(estabelecimento.criadoPor),
    createdAt: estabelecimento.createdAt ? estabelecimento.createdAt.toISOString() : null,
    updatedAt: estabelecimento.updatedAt ? estabelecimento.updatedAt.toISOString() : null
  };
};

const serializarAreaDeRisco = (area) => ({
  id: area._id.toString(),
  cidade: area.cidade,
  regiao: area.regiao,
  nivel: area.nivel,
  descricao: area.descricao,
  latitude: area.latitude,
  longitude: area.longitude
});

const resolvers = {
  perfil: comErro(async (args, contexto) => {
    const usuarioToken = exigirAutenticacao(contexto);
    const usuario = await usuarioService.buscarPerfil(usuarioToken.id);
    return serializarUsuario(usuario);
  }),

  // Consulta pública: pontos, eventos e estabelecimentos podem ser vistos sem login
  // (a descoberta turística da Home depende disso). Alterar dados continua exigindo permissão.
  pontosTuristicos: comErro(async () => {
    const pontos = await pontoTuristicoService.listar();
    return pontos.map(serializarPontoTuristico);
  }),

  pontoTuristico: comErro(async ({ id }) => {
    const ponto = await pontoTuristicoService.buscarPorId(id);
    return serializarPontoTuristico(ponto);
  }),

  eventos: comErro(async () => {
    const eventos = await eventoService.listar();
    return eventos.map(serializarEvento);
  }),

  evento: comErro(async ({ id }) => {
    const evento = await eventoService.buscarPorId(id);
    return serializarEvento(evento);
  }),

  estabelecimentos: comErro(async ({ cidade, categoria }) => {
    const lista = await estabelecimentoService.listar(cidade, categoria);
    return lista.map(serializarEstabelecimento);
  }),

  estabelecimento: comErro(async ({ id }) => {
    const estabelecimento = await estabelecimentoService.buscarPorId(id);
    return serializarEstabelecimento(estabelecimento);
  }),

  meuEstabelecimento: comErro(async (args, contexto) => {
    const usuario = exigirAutenticacao(contexto);
    const estabelecimento = await estabelecimentoService.buscarDoUsuario(usuario.id);
    return serializarEstabelecimento(estabelecimento);
  }),

  areasDeRisco: comErro(async ({ cidade }) => {
    const areas = await areaDeRiscoService.listar(cidade);
    return areas.map(serializarAreaDeRisco);
  }),

  cadastrar: comErro(async ({ input }) => {
    const usuario = await usuarioService.cadastrar(input);
    return {
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: serializarUsuario(usuario)
    };
  }),

  login: comErro(async ({ input }) => {
    const { token, usuario } = await usuarioService.login(input, 'comum');
    return {
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: serializarUsuario(usuario)
    };
  }),

  loginProfissional: comErro(async ({ input }) => {
    const { token, usuario } = await usuarioService.login(input, 'profissional');
    return {
      mensagem: 'Login profissional realizado com sucesso',
      token,
      usuario: serializarUsuario(usuario)
    };
  }),

  cadastrarEstabelecimento: comErro(async ({ input }, contexto) => {
    const usuario = exigirAutenticacao(contexto);

    if (usuario.perfil !== 'profissional' && usuario.perfil !== 'instituicao') {
      throw new GraphQLError('Usuário não possui permissão', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const estabelecimento = await estabelecimentoService.criar(input, usuario);
    return serializarEstabelecimento(estabelecimento);
  }),

  // Propriedade validada em estabelecimentoService.atualizar
  atualizarEstabelecimento: comErro(async ({ id, input }, contexto) => {
    const usuario = exigirAutenticacao(contexto);
    const estabelecimento = await estabelecimentoService.atualizar(id, input, usuario);
    return serializarEstabelecimento(estabelecimento);
  }),

  excluirEstabelecimento: comErro(async ({ id }, contexto) => {
    exigirProfissional(contexto);
    await estabelecimentoService.excluir(id);
    return { mensagem: 'Estabelecimento excluído com sucesso' };
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

  definirNivelRiscoPontoTuristico: comErro(async ({ id, nivelRisco }, contexto) => {
    exigirProfissional(contexto);
    const ponto = await pontoTuristicoService.definirNivelRisco(id, nivelRisco);
    return serializarPontoTuristico(ponto);
  }),

  definirNivelRiscoEvento: comErro(async ({ id, nivelRisco }, contexto) => {
    exigirProfissional(contexto);
    const evento = await eventoService.definirNivelRisco(id, nivelRisco);
    return serializarEvento(evento);
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
