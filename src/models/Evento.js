const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    data: { type: Date, required: true },
    local: { type: String, required: true },
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

module.exports = mongoose.model('Evento', eventoSchema);
