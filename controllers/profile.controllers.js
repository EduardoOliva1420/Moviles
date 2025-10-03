// controllers/profile.controllers.js
const Profile = require("../models/profile");

async function createFull(req, res, next) {
  try {
    const profile = new Profile(req.validated);
    await profile.save();
    res.status(201).json(profile);
  } catch (e) {
    next(e);
  }
}

async function list(req, res, next) {
  try {
    const profiles = await Profile.find().lean();
    res.json(profiles);
  } catch (e) {
    next(e);
  }
}

async function getOne(req, res, next) {
  try {
    const p = await Profile.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Perfil no encontrado" });
    res.json(p);
  } catch (e) {
    next(e);
  }
}

async function deleteProfile(req, res, next) {
  try {
    const deleted = await Profile.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Perfil no encontrado" });
    res.json({ message: "Perfil eliminado" });
  } catch (e) {
    next(e);
  }
}

module.exports = { createFull, list, getOne, deleteProfile };