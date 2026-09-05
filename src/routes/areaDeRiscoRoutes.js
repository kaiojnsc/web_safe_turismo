const express = require('express');

const {
  cadastrarAreaDeRisco,
  listarAreasDeRisco,
  buscarAreaDeRisco,
  atualizarAreaDeRisco,
  excluirAreaDeRisco
} = require('../controllers/areaDeRiscoController');

const { autenticar, autorizar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/areas-de-risco',
  autenticar,
  autorizar('profissional'),
  cadastrarAreaDeRisco
);

router.get(
  '/areas-de-risco',
  autenticar,
  listarAreasDeRisco
);

router.get(
  '/areas-de-risco/:id',
  autenticar,
  buscarAreaDeRisco
);

router.put(
  '/areas-de-risco/:id',
  autenticar,
  autorizar('profissional'),
  atualizarAreaDeRisco
);

router.delete(
  '/areas-de-risco/:id',
  autenticar,
  autorizar('profissional'),
  excluirAreaDeRisco
);

module.exports = router;