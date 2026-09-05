const mongoose = require('mongoose');

const pontoTuristicoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    categoria: { type: String },
    endereco: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
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

module.exports = mongoose.model('PontoTuristico', pontoTuristicoSchema);
