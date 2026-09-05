const Evento = require('../models/Evento');

const cadastrarEvento = async (req, res) => {
  try {
    const { nome, descricao, data, local } = req.body;

    if (!nome || !descricao || !data || !local) {
      return res.status(400).json({
        mensagem: 'Nome, descrição, data e local são obrigatórios'
      });
    }

    const evento = new Evento({
      nome,
      descricao,
      data,
      local,
      criadoPor: req.usuario.id
    });

    const eventoSalvo = await evento.save();

    res.status(201).json({
      mensagem: 'Evento cadastrado com sucesso',
      evento: eventoSalvo
    });
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao cadastrar evento',
      erro: error.message
    });
  }
};

const listarEventos = async (req, res) => {
  try {
    const eventos = await Evento.find().populate('criadoPor', 'nome email');

    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao listar eventos',
      erro: error.message
    });
  }
};

const buscarEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await Evento.findById(id).populate('criadoPor', 'nome email');

    if (!evento) {
      return res.status(404).json({
        mensagem: 'Evento não encontrado'
      });
    }

    res.status(200).json(evento);
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao buscar evento',
      erro: error.message
    });
  }
};

const atualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, data, local } = req.body;

    const evento = await Evento.findByIdAndUpdate(
      id,
      { nome, descricao, data, local },
      { new: true, runValidators: true }
    );

    if (!evento) {
      return res.status(404).json({
        mensagem: 'Evento não encontrado'
      });
    }

    res.status(200).json({
      mensagem: 'Evento atualizado com sucesso',
      evento
    });
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao atualizar evento',
      erro: error.message
    });
  }
};

const excluirEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await Evento.findByIdAndDelete(id);

    if (!evento) {
      return res.status(404).json({
        mensagem: 'Evento não encontrado'
      });
    }

    res.status(200).json({
      mensagem: 'Evento excluído com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao excluir evento',
      erro: error.message
    });
  }
};

module.exports = {
  cadastrarEvento,
  listarEventos,
  buscarEvento,
  atualizarEvento,
  excluirEvento
};
