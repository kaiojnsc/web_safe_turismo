const express = require('express');

const {
  cadastrarPontoTuristico,
  listarPontosTuristicos,
  buscarPontoTuristico,
  atualizarPontoTuristico,
  excluirPontoTuristico
} = require('../controllers/pontoTuristicoController');

const { autenticar, autorizar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/pontos-turisticos',
  autenticar,
  autorizar('profissional'),
  cadastrarPontoTuristico
);

router.get('/pontos-turisticos', autenticar, listarPontosTuristicos);

router.get('/pontos-turisticos/:id', autenticar, buscarPontoTuristico);

router.put(
  '/pontos-turisticos/:id',
  autenticar,
  autorizar('profissional'),
  atualizarPontoTuristico
);

router.delete(
  '/pontos-turisticos/:id',
  autenticar,
  autorizar('profissional'),
  excluirPontoTuristico
);

module.exports = router;
