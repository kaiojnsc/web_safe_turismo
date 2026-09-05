const express = require('express');

const {
  cadastrarEvento,
  listarEventos,
  buscarEvento,
  atualizarEvento,
  excluirEvento
} = require('../controllers/eventoController');

const { autenticar, autorizar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/eventos', autenticar, autorizar('profissional'), cadastrarEvento);

router.get('/eventos', autenticar, listarEventos);

router.get('/eventos/:id', autenticar, buscarEvento);

router.put(
  '/eventos/:id',
  autenticar,
  autorizar('profissional'),
  atualizarEvento
);

router.delete(
  '/eventos/:id',
  autenticar,
  autorizar('profissional'),
  excluirEvento
);

module.exports = router;
