const usuarioService = require('../services/usuarioService');
const tratarErroRest = require('../utils/tratarErroRest');

const buscarPerfil = async (req, res) => {
  try {
    const usuario = await usuarioService.buscarPerfil(req.usuario.id);

    res.status(200).json({
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao buscar perfil');
  }
};

const atualizarPerfil = async (req, res) => {
  try {
    const usuario = await usuarioService.atualizarPerfil(req.usuario.id, req.body);

    res.status(200).json({
      mensagem: 'Perfil atualizado com sucesso',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao atualizar perfil');
  }
};

const excluirPerfil = async (req, res) => {
  try {
    await usuarioService.excluirPerfil(req.usuario.id);

    res.status(200).json({
      mensagem: 'Conta excluída com sucesso'
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao excluir conta');
  }
};

module.exports = {
  buscarPerfil,
  atualizarPerfil,
  excluirPerfil
};
