// models/profile.js
const { Schema, model } = require("mongoose");

const educationSchema = new Schema({
  level: String,
  field: String,
  languages: String,
  certifications: String,
});

const experienceSchema = new Schema({
  previousJob: String,
  projects: [{ role_improved: String }],
  tools: String,
});

const softSkillsSchema = new Schema({
  comunicacionEfectiva: Number,
  trabajoEnEquipo: Number,
  resolucionDeProblemas: Number,
  adaptabilidad: Number,
  gestionDelTiempo: Number,
});

const digitalSkillsSchema = new Schema({
  herramientas_dig_bas: Number,
  herramientas_trabajo: Number,
  capacidad_analisis: Number,
  gestion_proyecto: Number,
  compe_dig_bas: Number,
});

const jobInformationSchema = new Schema({
  actualPosition: String,
  timeInJob: Number,
  functionsJob: [String],
  technicalReq: [String],
  improveAreas: [String],
});

const learningMethodSchema = new Schema({
  modalidad_preferida: String,
  tiempo_disponible: String,
  metodo_aprendizaje: [String],
  certificaciones: [String],
});

const profileSchema = new Schema(
  {
    basic: {
      name: String,
      email: { type: String, lowercase: true },
      age: Number,
      gender: [String],
      country: String,
      state: String,
      city: String,
    },
    education: [educationSchema],
    experience: [experienceSchema],
    softSkills: softSkillsSchema,
    digitalSkills: digitalSkillsSchema,
    jobInformation: jobInformationSchema,
    learningMethod: learningMethodSchema,
    submittedAt: Date,
  },
  { timestamps: true }
);

module.exports = model("Profile", profileSchema);