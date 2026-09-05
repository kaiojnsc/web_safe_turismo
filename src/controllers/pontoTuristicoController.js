const PontoTuristico = require('../models/PontoTuristico');

const cadastrarPontoTuristico = async (req, res) => {
  try {
    const { nome, descricao, categoria, endereco, latitude, longitude } = req.body;

    if (!nome || !descricao) {
      return res.status(400).json({
        mensagem: 'Nome e descrição são obrigatórios'
      });
    }

    const pontoTuristico = new PontoTuristico({
      nome,
      descricao,
      categoria,
      endereco,
      latitude,
      longitude,
      criadoPor: req.usuario.id
    });

    const pontoSalvo = await pontoTuristico.save();

    res.status(201).json({
      mensagem: 'Ponto turístico cadastrado com sucesso',
      pontoTuristico: pontoSalvo
    });
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao cadastrar ponto turístico',
      erro: error.message
    });
  }
};

const listarPontosTuristicos = async (req, res) => {
  try {
    const pontosTuristicos = await PontoTuristico.find().populate(
      'criadoPor',
      'nome email'
    );

    res.status(200).json(pontosTuristicos);
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao listar pontos turísticos',
      erro: error.message
    });
  }
};

const buscarPontoTuristico = async (req, res) => {
  try {
    const { id } = req.params;

    const pontoTuristico = await PontoTuristico.findById(id).populate(
      'criadoPor',
      'nome email'
    );

    if (!pontoTuristico) {
      return res.status(404).json({
        mensagem: 'Ponto turístico não encontrado'
      });
    }

    res.status(200).json(pontoTuristico);
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao buscar ponto turístico',
      erro: error.message
    });
  }
};

const atualizarPontoTuristico = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, categoria, endereco, latitude, longitude } = req.body;

    const pontoTuristico = await PontoTuristico.findByIdAndUpdate(
      id,
      { nome, descricao, categoria, endereco, latitude, longitude },
      { new: true, runValidators: true }
    );

    if (!pontoTuristico) {
      return res.status(404).json({
        mensagem: 'Ponto turístico não encontrado'
      });
    }

    res.status(200).json({
      mensagem: 'Ponto turístico atualizado com sucesso',
      pontoTuristico
    });
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao atualizar ponto turístico',
      erro: error.message
    });
  }
};

const excluirPontoTuristico = async (req, res) => {
  try {
    const { id } = req.params;

    const pontoTuristico = await PontoTuristico.findByIdAndDelete(id);

    if (!pontoTuristico) {
      return res.status(404).json({
        mensagem: 'Ponto turístico não encontrado'
      });
    }

    res.status(200).json({
      mensagem: 'Ponto turístico excluído com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao excluir ponto turístico',
      erro: error.message
    });
  }
};

module.exports = {
  cadastrarPontoTuristico,
  listarPontosTuristicos,
  buscarPontoTuristico,
  atualizarPontoTuristico,
  excluirPontoTuristico
};
