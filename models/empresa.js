// models/empresa.js
import mongoose from "mongoose";

const suscripcionSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['basica', 'profesional', 'empresarial'],
    required: true
  },
  estado: {
    type: String,
    enum: ['activa', 'pausada', 'cancelada'],
    default: 'activa'
  },
  fechaInicio: {
    type: Date,
    default: Date.now
  },
  fechaFin: {
    type: Date,
    required: true
  },
  colaboradoresDisponibles: {
    type: Number,
    required: true
  },
  colaboradoresActuales: {
    type: Number,
    default: 0
  },
  precio: {
    type: Number,
    required: true
  }
});

const empresaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  rut: {
    type: String,
    required: true,
    unique: true
  },
  telefono: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  ciudad: {
    type: String,
    required: true
  },
  pais: {
    type: String,
    required: true
  },
  suscripcion: suscripcionSchema,
  usuarioAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  encargadosCapacitacion: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  colaboradores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  estado: {
    type: String,
    enum: ['activa', 'inactiva', 'cancelada'],
    default: 'activa'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Empresa', empresaSchema);
