const Profile = require('../models/profile');

function createDraft(basic) {
  return Profile.create({ basic, step: 1 });
}

function updateBasic(id, basic) {
  return Profile.findByIdAndUpdate(id, { basic, step: 2 }, { new: true, runValidators: true });
}

async function addEducation(id, edu) {
  const p = await Profile.findById(id);
  if (!p) return null;
  p.education.push(edu);
  if (p.step < 3) p.step = 3;
  await p.save();
  return p;
}

async function replaceEducation(id, list) {
  const p = await Profile.findById(id);
  if (!p) return null;
  p.education = list;
  if (p.step < 3) p.step = 3;
  await p.save();
  return p;
}

async function addExperience(id, exp) {
  const p = await Profile.findById(id);
  if (!p) return null;
  p.experience.push(exp);
  if (p.step < 4) p.step = 4;
  await p.save();
  return p;
}

async function replaceExperience(id, list) {
  const p = await Profile.findById(id);
  if (!p) return null;
  p.experience = list;
  if (p.step < 4) p.step = 4;
  await p.save();
  return p;
}

async function addSoftSkills(id, skills) {
  const p = await Profile.findById(id);
  if (!p) return null;
  p.softSkills.push(skills);
  await p.save();
  return p;
}

async function addTechSkills(id, tech_skill) {
  const p = await Profile.findById(id);
  if (!p) return null;
  p.digitalSkills.push(tech_skill);
  await p.save();
  return p;
}

async function addLearningMethod(id, learn) {
  const p = await Profile.findById(id);
  if (!p) return null;
  p.learningMethod.push(learn);
  await p.save();
  return p;
}

async function addJobInformation(id, jI) {
  const p = await Profile.findById(id);
  if (!p) return null;
  p.jobInformation.push(jI);
  await p.save();
  return p;
}

const getById = (id) => Profile.findById(id);

const list = (q = {}, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  return Promise.all([
    Profile.find(q).skip(skip).limit(limit),
    Profile.countDocuments(q)
  ]).then(([items, total]) => ({ items, total, page, pages: Math.ceil(total/limit) }));
};

async function markSubmitted(id) {
  return Profile.findByIdAndUpdate(id, { submittedAt: new Date() }, { new: true });
}

async function saveRecommendations(id, data) {
  return Profile.findByIdAndUpdate(
    id,
    { recommendations: { data, receivedAt: new Date() } },
    { new: true }
  );
}

// 🔹 Nuevo: eliminar perfil
async function deleteById(id) {
  return Profile.findByIdAndDelete(id);
}

module.exports = {
  createDraft, updateBasic,
  addEducation, replaceEducation,
  addExperience, replaceExperience,
  getById, list, markSubmitted, saveRecommendations,
  addSoftSkills,deleteById, addJobInformation, addTechSkills, addLearningMethod// exportar la función nueva
};
