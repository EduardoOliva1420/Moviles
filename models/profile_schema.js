// models/profile_schema.js
const { z } = require("zod");

const basicSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(1),
  gender: z.array(z.enum(["Masculino","Femenino","Otro","Prefiero no decirlo"])).min(1),
  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
});

const educationItemSchema = z.object({
  level: z.string().min(1),
  field: z.string().min(1),
  languages: z.string().min(1),
  certifications: z.string().optional(),
});

const experienceItemSchema = z.object({
  previousJob: z.string().min(1),
  projects: z.array(z.object({ role_improved: z.string().min(1) })),
  tools: z.string().min(1),
});

const softSkills = z.object({
  comunicacionEfectiva: z.number().min(1).max(5),
  trabajoEnEquipo: z.number().min(1).max(5),
  resolucionDeProblemas: z.number().min(1).max(5),
  adaptabilidad: z.number().min(1).max(5),
  gestionDelTiempo: z.number().min(1).max(5),
});

const digitalSkills = z.object({
  herramientas_dig_bas: z.number().min(1).max(5),
  herramientas_trabajo: z.number().min(1).max(5),
  capacidad_analisis: z.number().min(1).max(5),
  gestion_proyecto: z.number().min(1).max(5),
  compe_dig_bas: z.number().min(1).max(5),
});

const jobInformation = z.object({
  actualPosition: z.string().min(1),
  timeInJob: z.number().min(1),
  functionsJob: z.array(z.string().min(1)),
  technicalReq: z.array(z.string().min(1)),
  improveAreas: z.array(z.string().min(1)),
});

const learningMethod = z.object({
  modalidad_preferida: z.string().min(1),
  tiempo_disponible: z.string().min(1),
  metodo_aprendizaje: z.array(z.enum(["videos","lecturas","talleres","mentoria"])),
  certificaciones: z.array(z.enum(["si","no"])),
});

// 🔹 Nuevo schema unificado
const fullProfileSchema = z.object({
  basic: basicSchema,
  education: z.array(educationItemSchema).optional(),
  experience: z.array(experienceItemSchema).optional(),
  softSkills: softSkills.optional(),
  digitalSkills: digitalSkills.optional(),
  jobInformation: jobInformation.optional(),
  learningMethod: learningMethod.optional(),
});

module.exports = {
  fullProfileSchema,
};