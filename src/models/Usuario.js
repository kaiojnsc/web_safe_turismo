const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    senha: { type: String, required: true, select: false },
    perfil: {
      type: String,
      enum: ['turista', 'profissional'],
      default: 'turista',
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
