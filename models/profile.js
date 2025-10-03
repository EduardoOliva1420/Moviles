const { Schema, model } = require('mongoose');
const { array } = require('zod');

const educationSchema = new Schema({
  level: { type: String, required: true },         // ej: Licenciatura, Maestría
  field: { type: String, required: true },         // área/ carrera
  languagues: { type: String },
  certifications: [{ name: String,}],
}, { _id:true });

const experienceSchema = new Schema({
  previousJob: { type: String, required: true },
  projects: [{
  role_improved: { type: String, required: true }
}],
  tools: { type: String, required:true}
}, { _id: true });

const softSkills = new Schema({
  comunicacionEfectiva: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  trabajoEnEquipo: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  resolucionDeProblemas: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  adaptabilidad: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  gestionDelTiempo: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
},{ _id: true });

const digitalSkills = new Schema({
  herramientas_dig_bas: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  herramientas_trabajo: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  capacidad_analisis: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  gestion_proyecto: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  compe_dig_bas: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, { _id: true });

const learningMethod = new Schema({
  modalidad_preferida: {
    type: String,
    required: true
  },
  tiempo_disponible: {
    type: String,
    required: true
  },
  metodo_aprendizaje: {
    type: [String],
    enum: ["videos", "lecturas", "talleres", "mentoria"],
    required: true
  },
  certificaciones: {
    type: [String],
    enum: ["si", "no"],
    required: true
  }
}, { _id: true });



const jobInformation = new Schema({
  actualPosition: { type: String, required: true},
  timeInJob: { type: String, required: true},
  functionsJob: [String],
  technicalReq: [String],
  improveAreas: [String],
},{ _id:true })

const profileSchema = new Schema({
  step: { type: Number, default: 1 }, // 1: básicos, 2: educativos, 3: laborales, 4: listo
  basic: {
    name:      { type: String, required: true },
    email:     { type: String, required: true, lowercase: true, index: true },
    age:       {type: Number, required:true},
    gender: { type: [String], 
      enum: ["Masculino", "Femenino", "Otro", "Prefiero no decirlo"], 
      required: true 
    },
    country:   { type: String, required: true, lowercase: true},
    state:     { type: String, required: true, lowercase: true},
    city:      { type: String, required: true, lowercase: true}
  },
  education: [educationSchema],
  softSkills: [softSkills],
  jobInformation: [jobInformation],
  experience: [experienceSchema],
  digitalSkills:[digitalSkills],
  learningMethod:[learningMethod],
  submittedAt: { type: Date },
  recommendations: {
    receivedAt: { type: Date },
    data: Schema.Types.Mixed // lo que devuelva la API
  }
}, { timestamps: true });

module.exports = model('Profile', profileSchema);