// controllers/profile.controllers.js
import Profile from "../models/profile.js";
import { generateRecommendationsMessage } from "../services/openai.recommender.js";

// Crear perfil completo
export async function createFull(req, res, next) {
  try {

    const profile = new Profile({ ...req.validated, submittedAt: req.validated?.submittedAt || new Date() });
    await profile.save();
    // Generate a single message with OpenAI recommendations (best-effort)
    let message;
    try {
      const plain = typeof profile.toObject === 'function' ? profile.toObject() : JSON.parse(JSON.stringify(profile));
      message = await generateRecommendationsMessage(plain);
    } catch (aiErr) {
      message = "No se pudieron generar recomendaciones ahora.";
    }

    res.status(201).json({ message });
  } catch (e) {
    next(e);
  }
}

// Listar todos los perfiles
export async function list(req, res, next) {
  try {
    const profiles = await Profile.find().lean();
    res.json(profiles);
  } catch (e) {
    next(e);
  }
}

// Obtener un perfil por ID
export async function getOne(req, res, next) {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Perfil no encontrado" });
    res.json(profile);
  } catch (e) {
    next(e);
  }
}

// Eliminar un perfil
export async function deleteProfile(req, res, next) {
  try {
    const deleted = await Profile.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Perfil no encontrado" });
    res.json({ message: "Perfil eliminado" });
  } catch (e) {
    next(e);
  }
}
