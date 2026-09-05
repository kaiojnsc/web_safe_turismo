const mongoose = require('mongoose');

const areaDeRiscoSchema = new mongoose.Schema(
  {
    cidade: {
      type: String,
      required: true
    },

    regiao: {
      type: String
    },

    nivel: {
      type: String,
      enum: ['baixo', 'medio', 'alto'],
      required: true
    },

    descricao: {
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

module.exports = mongoose.model('AreaDeRisco', areaDeRiscoSchema);