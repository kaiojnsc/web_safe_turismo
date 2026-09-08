const express = require('express');

const {
  cadastrarEstabelecimento,
  listarEstabelecimentos,
  buscarEstabelecimento,
  atualizarEstabelecimento,
  excluirEstabelecimento
} = require('../controllers/estabelecimentoController');

const {
  autenticar,
  autorizar
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/estabelecimentos',
  autenticar,
  autorizar('profissional'),
  cadastrarEstabelecimento
);

router.get(
  '/estabelecimentos',
  autenticar,
  listarEstabelecimentos
);

router.get(
  '/estabelecimentos/:id',
  autenticar,
  buscarEstabelecimento
);

router.put(
  '/estabelecimentos/:id',
  autenticar,
  autorizar('profissional'),
  atualizarEstabelecimento
);

router.delete(
  '/estabelecimentos/:id',
  autenticar,
  autorizar('profissional'),
  excluirEstabelecimento
);

module.exports = router;