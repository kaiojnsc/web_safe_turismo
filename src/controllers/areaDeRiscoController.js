const areaDeRiscoService = require('../services/areaDeRiscoService');
const tratarErroRest = require('../utils/tratarErroRest');

const cadastrarAreaDeRisco = async (req, res) => {
  try {
    const areaDeRisco = await areaDeRiscoService.criar(
      req.body,
      req.usuario.id
    );

    res.status(201).json({
      mensagem: 'Área de risco cadastrada com sucesso',
      areaDeRisco
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao cadastrar área de risco');
  }
};

const listarAreasDeRisco = async (req, res) => {
  try {
    const areasDeRisco = await areaDeRiscoService.listar(
        req.query.cidade
    );

    res.status(200).json(areasDeRisco);
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao listar áreas de risco');
  }
};

const buscarAreaDeRisco = async (req, res) => {
  try {
    const areaDeRisco = await areaDeRiscoService.buscarPorId(
      req.params.id
    );

    res.status(200).json(areaDeRisco);
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao buscar área de risco');
  }
};

const atualizarAreaDeRisco = async (req, res) => {
  try {
    const areaDeRisco = await areaDeRiscoService.atualizar(
      req.params.id,
      req.body
    );

    res.status(200).json({
      mensagem: 'Área de risco atualizada com sucesso',
      areaDeRisco
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao atualizar área de risco');
  }
};

const excluirAreaDeRisco = async (req, res) => {
  try {
    await areaDeRiscoService.excluir(req.params.id);

    res.status(200).json({
      mensagem: 'Área de risco excluída com sucesso'
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao excluir área de risco');
  }
};

module.exports = {
  cadastrarAreaDeRisco,
  listarAreasDeRisco,
  buscarAreaDeRisco,
  atualizarAreaDeRisco,
  excluirAreaDeRisco
};