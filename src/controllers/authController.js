const usuarioService = require('../services/usuarioService');
const tratarErroRest = require('../utils/tratarErroRest');

const cadastrarUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.cadastrar(req.body);

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao cadastrar usuário');
  }
};

const login = async (req, res) => {
  try {
    const { token, usuario } = await usuarioService.login(req.body);

    res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    tratarErroRest(res, error, 'Erro ao realizar login');
  }
};

module.exports = {
  cadastrarUsuario,
  login
};
