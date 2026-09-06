const mongoose = require('mongoose');

const pontoTuristicoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, required: true, trim: true },
    categoria: { type: String, trim: true, index: true },
    endereco: { type: String, trim: true },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    criadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PontoTuristico', pontoTuristicoSchema);
