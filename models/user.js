// models/user.js
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['super_usuario', 'empresa', 'encargado_capacitacion', 'colaborador'],
    required: true
  },
  estado: {
    type: String,
    enum: ['activo', 'pendiente_activacion', 'inactivo'],
    default: 'pendiente_activacion'
  },
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    default: null
  },
  permisos: [{
    type: String
  }],
  perfilCompleto: {
    type: Boolean,
    default: false
  },
  perfilId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    default: null
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcryptjs.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
