const { z } = require('zod');

// Schema para la parte básica del perfil
const basicSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName:  z.string().min(1, "El apellido es obligatorio"),
  email:     z.string().email("Debe ser un correo válido"),
  phone:     z.string().optional(),
  location:  z.string().optional(),
  gender:    z.string().optional()
});

// Schema para cada ítem de educación
const educationItemSchema = z.object({
  level: z.string().min(1, "Nivel de estudios obligatorio"),
  field: z.string().min(1, "Área o carrera obligatoria"),
  institution: z.string().min(1, "Institución obligatoria"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(['completed','in_progress','dropped']).optional(),
  languages: z.string().min(1,"Escoga al menos un idioma"),
  certifications: z.array(z.object({
    name: z.string().min(1, "Nombre de la certificación obligatorio"),
    issuer: z.string().optional(),
    date: z.coerce.date().optional()
  })).optional()
});

// Schema para cada ítem de experiencia laboral
const experienceItemSchema = z.object({
  title: z.string().min(1, "Título obligatorio"),
  department: z.string().optional(),
  company: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isCurrent: z.boolean().optional(),
  responsibilities: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  projects: z.array(z.object({
    role_improved: z.string().min(1,"Escoga al menos un rol"),
      tools: z.string().min(1,"Escriba al menos una herramienta que utilizo"),
      skill: z.string().optional()
  })).optional()
});

module.exports = {
  basicSchema,
  educationItemSchema,
  experienceItemSchema
};
