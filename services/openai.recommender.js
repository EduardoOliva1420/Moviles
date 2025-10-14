// services/openai.recommender.js (ESM)
import OpenAI from "openai";

let client = null;

function toSafeJson(input) {
  try {
    return JSON.parse(input);
  } catch (_) {
    // Try to extract a JSON block if model wrapped it in text
    const start = input.indexOf("{");
    const end = input.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const maybe = input.slice(start, end + 1);
      try { return JSON.parse(maybe); } catch { /* ignore */ }
    }
    return null;
  }
}

export async function generateRecommendations(profile) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { error: "OPENAI_API_KEY no configurada" };
  }
  if (!client) {
    client = new OpenAI({ apiKey });
  }

  const system = "Eres un asesor de carrera y aprendizaje. Estructura y prioriza recomendaciones claras y accionables.";
  const user = `Con los siguientes datos de perfil en JSON, genera recomendaciones personalizadas para el próximo trimestre.\n`
    `${JSON.stringify(profile)}`;

  try {
    const resp = await client.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.3,
    });

    const content = resp.choices?.[0]?.message?.content?.trim() || "";
    const parsed = toSafeJson(content);

    if (parsed) return parsed;
    return { raw: content };
  } catch (err) {
    return { error: "Fallo al generar recomendaciones", details: err?.message || String(err) };
  }
}

export async function generateRecommendationsMessage(profile) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return "No se pudieron generar recomendaciones en este momento (falta OPENAI_API_KEY).";
  }
  if (!client) {
    client = new OpenAI({ apiKey });
  }

  const system = "Eres un asesor de carrera y aprendizaje. Devuelve una respuesta breve y clara en español con recomendaciones accionables.";
  const user = `Con los siguientes datos de perfil en JSON, redacta recomendaciones personalizadas para el próximo trimestre en formato de viñetas cortas.\n` +
    `Perfil:\n${JSON.stringify(profile)}`;

  try {
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.5,
    });
    const content = resp.choices?.[0]?.message?.content?.trim() || "";
    return content || "No se generó contenido";
  } catch (err) {
    return `No se pudieron generar recomendaciones: ${err?.message || String(err)}`;
  }
}
