const eventoService = require('../services/eventoService');
const tratarErroRest = require('../utils/tratarErroRest');

const cadastrarEvento = async (req, res) => {
  try {
    const evento = await eventoService.criar(req.body, req.usuario.id);

    res.status(201).json({
      mensagem: 'Evento cadastrado com sucesso',
      evento
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao cadastrar evento');
  }
};

const listarEventos = async (req, res) => {
  try {
    const eventos = await eventoService.listar();
    res.status(200).json(eventos);
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao listar eventos');
  }
};

const buscarEvento = async (req, res) => {
  try {
    const evento = await eventoService.buscarPorId(req.params.id);
    res.status(200).json(evento);
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao buscar evento');
  }
};

const atualizarEvento = async (req, res) => {
  try {
    const evento = await eventoService.atualizar(req.params.id, req.body);

    res.status(200).json({
      mensagem: 'Evento atualizado com sucesso',
      evento
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao atualizar evento');
  }
};

const excluirEvento = async (req, res) => {
  try {
    await eventoService.excluir(req.params.id);

    res.status(200).json({
      mensagem: 'Evento excluído com sucesso'
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao excluir evento');
  }
};

module.exports = {
  cadastrarEvento,
  listarEventos,
  buscarEvento,
  atualizarEvento,
  excluirEvento
};
