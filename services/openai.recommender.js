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

  const system = "Eres AuraLearn, un asistente experto en desarrollo profesional impulsado por inteligencia artificial. Tu objetivo es ayudar al usuario a alcanzar sus metas profesionales mediante un análisis completo de su perfil y la creación de un plan de capacitación personalizado.";
  const user = `A continuación te proporciono el perfil del usuario en formato JSON, junto con el puesto objetivo y sus preferencias de aprendizaje. Realiza el análisis y recomendaciones siguiendo este esquema:\n
${JSON.stringify(profile)}
\n
### Instrucciones
Analiza el CV completo del usuario (formación, experiencia, certificaciones, proyectos, habilidades, idiomas, etc.).
Identifica el puesto deseado y entiende las competencias, habilidades técnicas y conocimientos requeridos para alcanzarlo.
Compara el perfil actual con el perfil ideal, detectando brechas clave.
Genera un plan de capacitación estructurado (por etapas o meses) que ayude al usuario a cerrar esas brechas.
Recomienda cursos reales y actualizados en línea, en el idioma y formato que el usuario prefiera.
Entrega un reporte final claro y profesional, que sirva como guía práctica de desarrollo.

#### Estructura del análisis

**Competencias, habilidades y conocimientos**
Evalúa el perfil en cinco dimensiones:
a. Competencias estratégicas (planificación, liderazgo, resolución de problemas, toma de decisiones)
b. Habilidades técnicas (tecnologías, metodologías, herramientas, procesos)
c. Habilidades blandas (comunicación, trabajo en equipo, adaptabilidad, liderazgo, organización)
d. Conocimientos clave (dominios teóricos y conceptuales relevantes)
e. Competencias interpersonales y de gestión (relación con colegas, empatía, influencia, gestión de conflictos)
Para cada dimensión, señala brevemente el nivel estimado (Básico / Intermedio / Avanzado) y explica cómo se infiere del CV.

**Roles meta y trayectorias posibles**
Sugiere tres roles alternativos o intermedios a los que el usuario podría aspirar según su perfil, con breve explicación de por qué cada uno es viable.

**Brechas principales y áreas de mejora**
Identifica y clasifica las brechas entre el perfil actual y el perfil objetivo: competencias a reforzar, habilidades técnicas que debe adquirir o actualizar, conocimientos que requieren consolidación. Asigna prioridad (Alta / Media / Baja) a cada brecha según su impacto.

**Plan de capacitación (Los meses requeridos)**
Organiza una ruta de aprendizaje por fases, con metas claras y actividades concretas para cada mes. Incluye métodos sugeridos: cursos en línea, proyectos, autoevaluaciones, participación en comunidades.

**Cursos y recursos reales recomendados**
Para cada competencia o habilidad clave, busca cursos reales disponibles en línea. Incluye nombre, plataforma, descripción breve, idioma, enlace directo, duración estimada y motivo de la recomendación. Prefiere plataformas reconocidas y ajusta a los parámetros del usuario.

**Reporte final de desarrollo**
El informe final debe estar estructurado y agradable a la vista, en formato Markdown, y contener:
- Perfil resumido
- Brechas detectadas (tabla o lista con prioridades)
- Ruta de aprendizaje (plan mes a mes o por fases)
- Cursos recomendados (listado con enlaces y duración)
- Indicadores de progreso (cómo sabrá el usuario que está avanzando)
- Recomendaciones adicionales (lecturas, comunidades, certificaciones, prácticas)

**Estilo y tono**
Usa lenguaje profesional, accesible y motivador. Presenta la información con espaciado y encabezados claros. Evita listas numeradas automáticas. Organiza el contenido en secciones bien separadas, tipo ficha de análisis. Integra las explicaciones de manera fluida dentro de cada sección.
Presenta todo en formato Markdown, con razonamiento paso a paso antes de las conclusiones.`;

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
  const system = "Eres AuraLearn, un asistente experto en desarrollo profesional impulsado por inteligencia artificial. Tu objetivo es ayudar al usuario a alcanzar sus metas profesionales mediante un análisis completo de su perfil y la creación de un plan de capacitación personalizado.";
  const user = `A continuación te proporciono el perfil del usuario en formato JSON, junto con el puesto objetivo y sus preferencias de aprendizaje. Realiza el análisis y recomendaciones siguiendo este esquema:\n
${JSON.stringify(profile)}
\n
### Instrucciones
Analiza el CV completo del usuario (formación, experiencia, certificaciones, proyectos, habilidades, idiomas, etc.).
Identifica el puesto deseado y entiende las competencias, habilidades técnicas y conocimientos requeridos para alcanzarlo.
Compara el perfil actual con el perfil ideal, detectando brechas clave.
Genera un plan de capacitación estructurado (por etapas o meses) que ayude al usuario a cerrar esas brechas.
Recomienda cursos reales y actualizados en línea, en el idioma y formato que el usuario prefiera.
Entrega un reporte final claro y profesional, que sirva como guía práctica de desarrollo.

#### Estructura del análisis

**Competencias, habilidades y conocimientos**
Evalúa el perfil en cinco dimensiones:
a. Competencias estratégicas (planificación, liderazgo, resolución de problemas, toma de decisiones)
b. Habilidades técnicas (tecnologías, metodologías, herramientas, procesos)
c. Habilidades blandas (comunicación, trabajo en equipo, adaptabilidad, liderazgo, organización)
d. Conocimientos clave (dominios teóricos y conceptuales relevantes)
e. Competencias interpersonales y de gestión (relación con colegas, empatía, influencia, gestión de conflictos)
Para cada dimensión, señala brevemente el nivel estimado (Básico / Intermedio / Avanzado) y explica cómo se infiere del CV.

**Roles meta y trayectorias posibles**
Sugiere tres roles alternativos o intermedios a los que el usuario podría aspirar según su perfil, con breve explicación de por qué cada uno es viable.

**Brechas principales y áreas de mejora**
Identifica y clasifica las brechas entre el perfil actual y el perfil objetivo: competencias a reforzar, habilidades técnicas que debe adquirir o actualizar, conocimientos que requieren consolidación. Asigna prioridad (Alta / Media / Baja) a cada brecha según su impacto.

**Plan de capacitación (Los meses requeridos)**
Organiza una ruta de aprendizaje por fases, con metas claras y actividades concretas para cada mes. Incluye métodos sugeridos: cursos en línea, proyectos, autoevaluaciones, participación en comunidades.

**Cursos y recursos reales recomendados**
Para cada competencia o habilidad clave, busca cursos reales disponibles en línea. Incluye nombre, plataforma, descripción breve, idioma, enlace directo, duración estimada y motivo de la recomendación. Prefiere plataformas reconocidas y ajusta a los parámetros del usuario.

**Reporte final de desarrollo**
El informe final debe estar estructurado y agradable a la vista, en formato Markdown, y contener:
- Perfil resumido
- Brechas detectadas (tabla o lista con prioridades)
- Ruta de aprendizaje (plan mes a mes o por fases)
- Cursos recomendados (listado con enlaces y duración)
- Indicadores de progreso (cómo sabrá el usuario que está avanzando)
- Recomendaciones adicionales (lecturas, comunidades, certificaciones, prácticas)

**Estilo y tono**
Usa lenguaje profesional, accesible y motivador. Presenta la información con espaciado y encabezados claros. Evita listas numeradas automáticas. Organiza el contenido en secciones bien separadas, tipo ficha de análisis. Integra las explicaciones de manera fluida dentro de cada sección.
Presenta todo en formato Markdown, con razonamiento paso a paso antes de las conclusiones.`;
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
