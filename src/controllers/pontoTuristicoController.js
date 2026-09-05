const pontoTuristicoService = require('../services/pontoTuristicoService');
const tratarErroRest = require('../utils/tratarErroRest');

const cadastrarPontoTuristico = async (req, res) => {
  try {
    const pontoTuristico = await pontoTuristicoService.criar(req.body, req.usuario.id);

    res.status(201).json({
      mensagem: 'Ponto turístico cadastrado com sucesso',
      pontoTuristico
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao cadastrar ponto turístico');
  }
};

const listarPontosTuristicos = async (req, res) => {
  try {
    const pontosTuristicos = await pontoTuristicoService.listar();
    res.status(200).json(pontosTuristicos);
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao listar pontos turísticos');
  }
};

const buscarPontoTuristico = async (req, res) => {
  try {
    const pontoTuristico = await pontoTuristicoService.buscarPorId(req.params.id);
    res.status(200).json(pontoTuristico);
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao buscar ponto turístico');
  }
};

const atualizarPontoTuristico = async (req, res) => {
  try {
    const pontoTuristico = await pontoTuristicoService.atualizar(req.params.id, req.body);

    res.status(200).json({
      mensagem: 'Ponto turístico atualizado com sucesso',
      pontoTuristico
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao atualizar ponto turístico');
  }
};

const excluirPontoTuristico = async (req, res) => {
  try {
    await pontoTuristicoService.excluir(req.params.id);

    res.status(200).json({
      mensagem: 'Ponto turístico excluído com sucesso'
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao excluir ponto turístico');
  }
};

module.exports = {
  cadastrarPontoTuristico,
  listarPontosTuristicos,
  buscarPontoTuristico,
  atualizarPontoTuristico,
  excluirPontoTuristico
};
