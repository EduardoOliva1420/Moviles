// controllers/profile.controllers.js
import Profile from "../models/profile.js";

// Crear perfil completo
export async function createFull(req, res, next) {
  try {
    const profile = new Profile(req.validated);
    await profile.save();
    res.status(201).json(profile);
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
