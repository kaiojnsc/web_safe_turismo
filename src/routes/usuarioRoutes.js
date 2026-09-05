const express = require('express');

const {
  buscarPerfil,
  atualizarPerfil,
  excluirPerfil
} = require('../controllers/usuarioController');

const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/usuarios/me', autenticar, buscarPerfil);
router.put('/usuarios/me', autenticar, atualizarPerfil);
router.delete('/usuarios/me', autenticar, excluirPerfil);

module.exports = router;
