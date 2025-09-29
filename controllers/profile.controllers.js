const svc = require('../services/profiles.service');
const { getRecommendations } = require('../services/recommender.service');

async function createDraft(req, res, next) {
  try {
    const p = await svc.createDraft(req.validated);
    console.log(p);
    console.log(req.validated);
  } catch (e) { next(e); }
}

async function updateBasic(req, res, next) {
  try {
    const p = await svc.updateBasic(req.params.id, req.validated);
    if (!p) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json(p);
  } catch (e) { next(e); }
}

async function addEducation(req, res, next) {
  try {
    const p = await svc.addEducation(req.params.id, req.validated);
    if (!p) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json(p);
  } catch (e) { next(e); }
}

async function replaceEducation(req, res, next) {
  try {
    // req.validated es un array de ítems education
    const p = await svc.replaceEducation(req.params.id, req.validated);
    if (!p) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json(p);
  } catch (e) { next(e); }
}

async function addExperience(req, res, next) {
  try {
    const p = await svc.addExperience(req.params.id, req.validated);
    if (!p) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json(p);
  } catch (e) { next(e); }
}

async function replaceExperience(req, res, next) {
  try {
    const p = await svc.replaceExperience(req.params.id, req.validated);
    if (!p) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json(p);
  } catch (e) { next(e); }
}

async function getOne(req, res, next) {
  try {
    const p = await svc.getById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json(p);
  } catch (e) { next(e); }
}

async function list(req, res, next) {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const filter = q ? { 'basic.firstName': new RegExp(q, 'i') } : {};
    const data = await svc.list(filter, { page: Number(page), limit: Number(limit) });
    res.json(data);
  } catch (e) { next(e); }
}

async function submitAndRecommend(req, res, next) {
  try {
    const p = await svc.markSubmitted(req.params.id);
    if (!p) return res.status(404).json({ message: 'Perfil no encontrado' });

    const reco = await getRecommendations(p);
    const saved = await svc.saveRecommendations(p.id, reco);

    res.json({ message: 'Perfil enviado y recomendaciones generadas', recommendations: saved.recommendations });
  } catch (e) { next(e); }
}

// 🔹 Nuevo: eliminar perfil
async function deleteProfile(req, res, next) {
  try {
    const deleted = await svc.deleteById(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json({ message: 'Perfil eliminado correctamente' });
  } catch (e) { next(e); }
}

module.exports = {
  createDraft, updateBasic,
  addEducation, replaceEducation,
  addExperience, replaceExperience,
  getOne, list, submitAndRecommend,
  deleteProfile // exportar la nueva función
};
