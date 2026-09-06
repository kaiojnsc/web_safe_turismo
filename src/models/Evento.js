const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, required: true, trim: true },
    data: { type: Date, required: true, index: true },
    local: { type: String, required: true, trim: true },
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

module.exports = mongoose.model('Evento', eventoSchema);
