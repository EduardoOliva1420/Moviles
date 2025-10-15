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

  const system = "Eres AuraLearn, un asistente experto en desarrollo profesional potenciado por IA. Tu misión es analizar el perfil del usuario y construir un diagnóstico, identificar brechas y proponer un plan de formación personalizado con cursos reales, siguiendo instrucciones detalladas.";
  const user = `A continuación te proporciono el perfil del usuario en formato JSON, junto con el puesto objetivo y sus preferencias de aprendizaje. Realiza el análisis y recomendaciones siguiendo este esquema:\n
${JSON.stringify(profile)}
\n
### Instrucciones
${`
1. Extrae información del CV y presenta un resumen conciso.
2. Diagnostica el perfil en dimensiones: competencias integrales, habilidades técnicas, habilidades blandas, conocimientos teóricos, competencias interpersonales. Evalúa cada una y justifica.
3. Sugiere 3 roles meta alternativos y explica por qué.
4. Detecta brechas respecto al puesto objetivo y priorízalas.
5. Construye un plan de capacitación a 3 meses con metas mensurables y métodos sugeridos.
6. Recomienda cursos reales en línea que cumplan las preferencias del usuario, con nombre, plataforma, descripción, enlace, justificación y duración.
7. Genera un informe final estructurado con diagnóstico, brechas, ruta de aprendizaje, cursos recomendados, indicadores de progreso y recomendaciones adicionales.
Presenta todo en formato Markdown, con razonamiento paso a paso antes de las conclusiones.`}`;

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

  // ...existing code...
  const system = "Eres AuraLearn, un asistente experto en desarrollo profesional potenciado por IA. Tu misión es analizar el perfil del usuario y construir un diagnóstico, identificar brechas y proponer un plan de formación personalizado con cursos reales, siguiendo instrucciones detalladas.";
  const user = `A continuación te proporciono el perfil del usuario en formato JSON, junto con el puesto objetivo y sus preferencias de aprendizaje. Realiza el análisis y recomendaciones siguiendo este esquema:\n
${JSON.stringify(profile)}
\n
### Instrucciones
${`
1. Extrae información del CV y presenta un resumen conciso.
2. Diagnostica el perfil en dimensiones: competencias integrales, habilidades técnicas, habilidades blandas, conocimientos teóricos, competencias interpersonales. Evalúa cada una y justifica.
3. Sugiere 3 roles meta alternativos y explica por qué.
4. Detecta brechas respecto al puesto objetivo y priorízalas.
5. Construye un plan de capacitación a 3 meses con metas mensurables y métodos sugeridos.
6. Recomienda cursos reales en línea que cumplan las preferencias del usuario, con nombre, plataforma, descripción, enlace, justificación y duración.
7. Genera un informe final estructurado con diagnóstico, brechas, ruta de aprendizaje, cursos recomendados, indicadores de progreso y recomendaciones adicionales.
Presenta todo en formato Markdown, con razonamiento paso a paso antes de las conclusiones.`}`;
// ...existing code...

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
