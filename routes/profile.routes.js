const { Router } = require('express');
const validateZod = require('../middlewares/validateZod');
const { basicSchema, educationItemSchema, experienceItemSchema } = require('../models/profile_schema.js');
const ctrl = require('../controllers/profile.controllers.js');

const router = Router();

// Paso 1: crear borrador con básicos
router.post('/', validateZod(basicSchema), ctrl.createDraft);

// Editar básicos
router.put('/:id/basic', validateZod(basicSchema), ctrl.updateBasic);

// Educación: agregar una y reemplazar todas
router.post('/:id/education', validateZod(educationItemSchema), ctrl.addEducation);
router.put('/:id/education', validateZod(educationItemSchema.array().min(1)), ctrl.replaceEducation);

// Experiencia: agregar una y reemplazar todas
router.post('/:id/experience', validateZod(experienceItemSchema), ctrl.addExperience);
router.put('/:id/experience', validateZod(experienceItemSchema.array().min(1)), ctrl.replaceExperience);

// Obtener y listar
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

// Enviar perfil y pedir recomendaciones
router.post('/:id/submit', ctrl.submitAndRecommend);

// 🔹 Eliminar perfil
router.delete('/:id', ctrl.deleteProfile);

module.exports = router;
