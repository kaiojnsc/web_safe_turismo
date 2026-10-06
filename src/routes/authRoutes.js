const express = require('express');

const { cadastrarUsuario, login, loginProfissional } = require('../controllers/authController');

const router = express.Router();

router.post('/auth/cadastro', cadastrarUsuario);
router.post('/auth/login', login);
router.post('/auth/login-profissional', loginProfissional);

module.exports = router;
