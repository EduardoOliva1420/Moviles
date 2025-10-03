// services/recommender.service.js
const axios = require("axios");

async function getRecommendations(profile) {
  const url = process.env.RECO_API_URL;
  const key = process.env.RECO_API_KEY;
  if (!url || !key) throw new Error("Configura RECO_API_URL y RECO_API_KEY");

  // Payload consolidado para enviar al motor de recomendaciones
  const payload = {
    candidate: {
      name: profile.basic.name,
      email: profile.basic.email,
      location: `${profile.basic.city}, ${profile.basic.state}, ${profile.basic.country}`,
      currentRole: profile.jobInformation?.actualPosition || "N/A",
      skills: [
        ...(profile.experience?.flatMap(e => e.projects.map(p => p.role_improved)) || []),
        ...(profile.digitalSkills ? Object.keys(profile.digitalSkills) : []),
        ...(profile.softSkills ? Object.keys(profile.softSkills) : []),
      ],
    },
    education: profile.education?.map(e => ({
      level: e.level,
      field: e.field,
      certifications: e.certifications,
    })) || [],
    experience: profile.experience?.map(x => ({
      previousJob: x.previousJob,
      tools: x.tools,
      projects: x.projects,
    })) || [],
  };

  const resp = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    timeout: 20000,
  });

  return resp.data;
}

module.exports = { getRecommendations };