const { Schema, model } = require('mongoose');

const educationSchema = new Schema({
  level: { type: String, required: true },         // ej: Licenciatura, Maestría
  field: { type: String, required: true },         // área/ carrera
  institution: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['completed','in_progress','dropped'], default: 'completed' },
  certifications: [{ name: String, issuer: String, date: Date }],
  languagues: { type: String },
}, { _id: true });

const experienceSchema = new Schema({
  title: { type: String, required: true },
  department: { type: String },
  company: { type: String, default: 'Mi Empresa' }, // interno/externo
  startDate: { type: Date },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  responsibilities: [String],
  skills: [String],
  projects: [{
  role_improved: { type: String, required: true },
  tools: { type: String, required: true },
  skill: { type: String }
}]
 ,
}, { _id: true });

const profileSchema = new Schema({
  step: { type: Number, default: 1 }, // 1: básicos, 2: educativos, 3: laborales, 4: listo
  basic: {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true, lowercase: true, index: true },
    phone:     { type: String },
    location:  { type: String },
    gender:    { type: String},

  },
  education: [educationSchema],
  experience: [experienceSchema],
  submittedAt: { type: Date },
  recommendations: {
    receivedAt: { type: Date },
    data: Schema.Types.Mixed // lo que devuelva la API
  }
}, { timestamps: true });

module.exports = model('Profile', profileSchema);