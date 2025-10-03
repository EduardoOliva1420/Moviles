const { z } = require('zod');

// Schema para la parte básica del perfil
const basicSchema = z.object({
  name:  z.string().min(1, "El Nombre completo es obligatorio"),
  email:     z.string().email("Debe ser un correo válido"),
  age:     z.number().min(1,"Edad obligatoria"),
  gender: z.array(
  z.enum(['Masculino','Femenino','Otro','Prefiero no decirlo'])).min(1, "Es obligatorio este campo"),
  country:  z.string().min(1, "El pais es obligatorio"),
  state:  z.string().min(1, "El estado es obligatorio"),
  city:  z.string().min(1, "La ciudad es obligatoria"),
});

// Schema para cada ítem de educación
const educationItemSchema = z.object({
  level: z.string().min(1, "Nivel de estudios obligatorio"),
  field: z.string().min(1, "Área o carrera obligatoria"),
  languages: z.string().min(1,"Escoga al menos un idioma"),
  certifications: z.string().min(1,"Escoga al menos un idioma").optional(),
  });

// Schema para cada ítem de experiencia laboral
const experienceItemSchema = z.object({
  previousJob: z.string().min(1, "Es obligatorio este campo"),
  projects: z.array(z.object({
    role_improved: z.string().min(1,"Escoga al menos un rol")
  })),
  tools: z.string().min(1,"Campo obligatorio")
});

//Habilidades Blandas
const softSkills = z.object({
  comunicacionEfectiva: z.number()
    .min(1, { message: "El valor mínimo es 1" })
    .max(5, { message: "El valor máximo es 5" }),
  
  trabajoEnEquipo: z.number()
    .min(1, { message: "El valor mínimo es 1" })
    .max(5, { message: "El valor máximo es 5" }),
  
  resolucionDeProblemas: z.number()
    .min(1, { message: "El valor mínimo es 1" })
    .max(5, { message: "El valor máximo es 5" }),
  
  adaptabilidad: z.number()
    .min(1, { message: "El valor mínimo es 1" })
    .max(5, { message: "El valor máximo es 5" }),
  
  gestionDelTiempo: z.number()
    .min(1, { message: "El valor mínimo es 1" })
    .max(5, { message: "El valor máximo es 5" })
});

const digitalSkills = z.object({
  herramientas_dig_bas: z.number()
    .min(1, { message: "El valor mínimo es 1" })
    .max(5, { message: "El valor máximo es 5" }),
  
  herramientas_trabajo: z.number()
    .min(1, { message: "El valor mínimo es 1" })
    .max(5, { message: "El valor máximo es 5" }),
  
  capacidad_analisis: z.number()
    .min(1, { message: "El valor mínimo es 1" })
    .max(5, { message: "El valor máximo es 5" }),
  
  gestion_proyecto: z.number()
    .min(1, { message: "El valor mínimo es 1" })
    .max(5, { message: "El valor máximo es 5" }),
  
  compe_dig_bas: z.number()
    .min(1, { message: "El valor mínimo es 1" })
    .max(5, { message: "El valor máximo es 5" })
});

  const jobInformation = z.object({
  actualPosition: z.string().min(1, "Puesto actual obligatorio"),
  timeInJob: z.string().min(1, "Tiempo en el puesto obligatorio"),
  functionsJob: z.array(z.string().min(1, "Cada función es obligatoria")),
  technicalReq: z.array(z.string().min(1, "Cada requisito técnico es obligatorio")),
  improveAreas: z.array(z.string().min(1, "Cada área de mejora es obligatoria"))
});

const learningMethod = z.object({
    modalidad_preferida: z.string().min(1, "Campo obligatorio"),
    tiempo_disponible: z.string().min(1, "Campo obligatorio"),
    metodo_aprendizaje: z.array(
      z.enum(["videos", "lecturas", "talleres", "mentoria"])
    ).min(1, "Debe seleccionar al menos una opción"),
    certificaciones: z.array(
      z.enum(["si", "no"])
    ).min(1, "Debe seleccionar al menos una opción")
  });

module.exports = {
  basicSchema,
  educationItemSchema,
  experienceItemSchema,
  softSkills, jobInformation, digitalSkills, learningMethod
};
