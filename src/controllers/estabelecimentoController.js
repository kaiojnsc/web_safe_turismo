const estabelecimentoService = require('../services/estabelecimentoService');
const tratarErroRest = require('../utils/tratarErroRest');

const cadastrarEstabelecimento = async (req, res) => {
  try {
    const estabelecimento = await estabelecimentoService.criar(
      req.body,
      req.usuario.id
    );

    res.status(201).json({
      mensagem: 'Estabelecimento cadastrado com sucesso',
      estabelecimento
    });
  } catch (error) {
    tratarErroRest(
      res,
      error,
      'Erro ao cadastrar estabelecimento'
    );
  }
};

const listarEstabelecimentos = async (req, res) => {
  try {
    const estabelecimentos = await estabelecimentoService.listar(
      req.query.cidade,
      req.query.categoria
    );

    res.status(200).json(estabelecimentos);
  } catch (error) {
    tratarErroRest(
      res,
      error,
      'Erro ao listar estabelecimentos'
    );
  }
};

const buscarEstabelecimento = async (req, res) => {
  try {
    const estabelecimento = await estabelecimentoService.buscarPorId(
      req.params.id
    );

    res.status(200).json(estabelecimento);
  } catch (error) {
    tratarErroRest(
      res,
      error,
      'Erro ao buscar estabelecimento'
    );
  }
};

const atualizarEstabelecimento = async (req, res) => {
  try {
    const estabelecimento = await estabelecimentoService.atualizar(
      req.params.id,
      req.body
    );

    res.status(200).json({
      mensagem: 'Estabelecimento atualizado com sucesso',
      estabelecimento
    });
  } catch (error) {
    tratarErroRest(
      res,
      error,
      'Erro ao atualizar estabelecimento'
    );
  }
};

const excluirEstabelecimento = async (req, res) => {
  try {
    await estabelecimentoService.excluir(req.params.id);

    res.status(200).json({
      mensagem: 'Estabelecimento excluído com sucesso'
    });
  } catch (error) {
    tratarErroRest(
      res,
      error,
      'Erro ao excluir estabelecimento'
    );
  }
};

module.exports = {
  cadastrarEstabelecimento,
  listarEstabelecimentos,
  buscarEstabelecimento,
  atualizarEstabelecimento,
  excluirEstabelecimento
};