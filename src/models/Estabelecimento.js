const mongoose = require('mongoose');

const estabelecimentoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true
    },

    descricao: {
      type: String,
      required: true
    },

    categoria: {
      type: String,
      required: true
    },

    endereco: {
      type: String
    },

    cidade: {
      type: String,
      required: true
    },

    latitude: {
      type: Number,
      min: -90,
      max: 90
    },

    longitude: {
      type: Number,
      min: -180,
      max: 180
    },

    criadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'Estabelecimento',
  estabelecimentoSchema
);