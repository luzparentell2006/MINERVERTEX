const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  montoInicial: {
    type: Number,
    default: 50,
    required: true
  },
  montoFinal: {
    type: Number,
    default: 0
  },
  gananciaDiaria: {
    type: Number,
    default: 0
  },
  diasRestantes: {
    type: Number,
    default: 31
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['activa', 'completada', 'cancelada'],
    default: 'activa'
  },
  gananciasAcumuladas: {
    type: Number,
    default: 0
  },
  comisionReferidos: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Investment', InvestmentSchema);
