// services/profile.service.js
const Profile = require('../models/profile');

// Crear perfil completo
function createFull(data) {
  return Profile.create(data);
}

// Obtener perfil por ID
function getById(id) {
  return Profile.findById(id);
}

// Listar perfiles con paginación
function list(q = {}, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;
  return Promise.all([
    Profile.find(q).skip(skip).limit(limit),
    Profile.countDocuments(q)
  ]).then(([items, total]) => ({
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  }));
}

// Marcar como enviado
async function markSubmitted(id) {
  return Profile.findByIdAndUpdate(
    id,
    { submittedAt: new Date() },
    { new: true }
  );
}

// Guardar recomendaciones
async function saveRecommendations(id, data) {
  return Profile.findByIdAndUpdate(
    id,
    { recommendations: { data, receivedAt: new Date() } },
    { new: true }
  );
}

// Eliminar perfil
async function deleteById(id) {
  return Profile.findByIdAndDelete(id);
}

module.exports = {
  createFull,
  getById,
  list,
  markSubmitted,
  saveRecommendations,
  deleteById,
};