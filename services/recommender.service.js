const axios = require('axios');

async function getRecommendations(profile) {
  const url = process.env.RECO_API_URL;
  const key = process.env.RECO_API_KEY;
  if (!url || !key) throw new Error('Configura RECO_API_URL y RECO_API_KEY');

  // payload consolidado (ajústalo a lo que espera tu API)
  const payload = {
    candidate: {
      name: `${profile.basic.firstName} ${profile.basic.lastName}`,
      email: profile.basic.email,
      location: profile.basic.location,
      currentRole: profile.basic.currentRole,
      department: profile.basic.department,
      desiredRole: profile.basic.desiredRole,
      skills: profile.basic.skills || []
    },
    education: profile.education.map(e => ({
      level: e.level, field: e.field, institution: e.institution,
      startDate: e.startDate, endDate: e.endDate, status: e.status,
      certifications: e.certifications
    })),
    experience: profile.experience.map(x => ({
      title: x.title, department: x.department, company: x.company,
      startDate: x.startDate, endDate: x.endDate, isCurrent: x.isCurrent,
      responsibilities: x.responsibilities, skills: x.skills, achievements: x.achievements
    }))
  };

  const resp = await axios.post(url, payload, {
    headers: { 'Authorization': Bearer `${key}, 'Content-Type': 'application/json' }`,
    timeout: 20000
  }});
  return resp.data;
}

module.exports = { getRecommendations };