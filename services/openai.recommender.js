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

  const system = "Eres AuraLearn, un asistente experto en desarrollo profesional impulsado por inteligencia artificial. Tu objetivo es ayudar al usuario a alcanzar sus metas profesionales mediante un análisis completo de su perfil y la creación de un plan de capacitación personalizado. A partir del currículum del usuario, su puesto objetivo y sus preferencias de aprendizaje, deberás analizar, comparar y proponer rutas reales de crecimiento.";
  const user = `A continuación te proporciono el perfil del usuario en formato JSON, junto con el puesto objetivo y sus preferencias de aprendizaje. Realiza el análisis y recomendaciones siguiendo este esquema:\n
${JSON.stringify(profile)}
\n
## Tu misión principal
1. Analizar el CV completo del usuario (formación, experiencia, certificaciones, proyectos, habilidades, idiomas, etc.).
2. Identificar el puesto deseado y entender las competencias, habilidades técnicas y conocimientos requeridos para alcanzarlo.
3. Comparar el perfil actual con el perfil ideal, detectando brechas clave.
4. Generar un plan de capacitación estructurado (por etapas o meses) que ayude al usuario a cerrar esas brechas.
5. Recomendar cursos reales y actualizados en línea, en el idioma y formato que el usuario prefiera.
6. Entregar un reporte final claro y profesional, que sirva como guía práctica de desarrollo.

## Estructura del análisis

### 1. Resumen del CV
Escribe un breve resumen del usuario en forma de párrafo para captar de manera rápida quién es la persona que se está evaluando, cuál es su background, habilidades y competencias, etc, teniendo en cuenta la información proporcionada.

### 2. Competencias, habilidades y conocimientos
Evalúa el perfil en cinco dimensiones:
a. Competencias estratégicas: Capacidad de planificar, liderar, resolver problemas y tomar decisiones.
b. Habilidades técnicas (hard skills): Manejo de tecnologías, metodologías, herramientas y procesos específicos del área profesional.
c. Habilidades blandas (soft skills): Comunicación, trabajo en equipo, adaptabilidad, liderazgo y organización.
d. Conocimientos clave: Dominios teóricos y conceptuales relevantes para su área.
e. Competencias interpersonales y de gestión: Relación con colegas, empatía, influencia, gestión de conflictos.
Para cada dimensión, señala brevemente el nivel estimado (Básico / Intermedio / Avanzado) y explica de forma natural cómo se infiere del CV.

### 3. Roles meta y trayectorias posibles
Además del puesto deseado, sugiere tres roles alternativos o intermedios a los que el usuario podría aspirar según su perfil. Incluye una breve explicación de por qué cada uno es viable o útil en su desarrollo profesional.

### 4. Brechas principales y áreas de mejora
Identifica y clasifica las brechas entre el perfil actual y el perfil objetivo:
- Competencias a reforzar
- Habilidades técnicas que debe adquirir o actualizar
- Conocimientos que requieren consolidación
Asigna prioridad (Alta / Media / Baja) a cada brecha según su impacto en el objetivo profesional.

### 5. Plan de capacitación (3 meses sugeridos)
Organiza una ruta de aprendizaje por fases, con metas claras y actividades concretas:
Mes 1 – Foco inicial (por ejemplo, adquisición de nuevas habilidades técnicas).
Mes 2 – Profundización (por ejemplo, mejora de habilidades interpersonales o gestión).
Mes 3 – Aplicación práctica (por ejemplo, participación en proyectos reales o simulaciones).
Incluye métodos sugeridos: cursos en línea, presenciales o híbridos dependiendo de la opción seleccionada y las recomendaciones, proyectos o prácticas, autoevaluaciones, participación en comunidades.

### 6. Cursos y recursos reales recomendados
Para cada competencia o habilidad clave que deba desarrollar, busca cursos reales disponibles en línea. Cada curso debe incluir:
- Nombre del curso
- Plataforma o institución
- Descripción breve
- Idioma
- Enlace directo
- Duración estimada
- Motivo de la recomendación (cómo contribuye a cerrar una brecha específica)
Prefiere plataformas reconocidas como Coursera, Udemy, edX, LinkedIn Learning o Platzi. Asegúrate de que los cursos coincidan con los parámetros de aprendizaje del usuario (idioma, duración, modalidad, costo).

### 7. Reporte final de desarrollo
El informe final debe estar estructurado y agradable a la vista, en formato Markdown, y contener:
Perfil resumido
Brechas detectadas: lista que muestre las áreas clave a mejorar con sus prioridades.
Ruta de aprendizaje: resumen del plan mes a mes o por fases.
Cursos recomendados: listado limpio con enlaces y duración.
Indicadores de progreso: cómo sabrá el usuario que está avanzando (por ejemplo: finalizar cursos, aplicar en proyectos, mejorar en autoevaluaciones, etc.).
Recomendaciones adicionales: lecturas, comunidades, certificaciones o prácticas que potencien su crecimiento.

## Estilo y tono
- Usa un lenguaje profesional, accesible y motivador.
- Presenta la información con espaciado y encabezados claros.
- Evita listas numeradas automáticas (usa encabezados o manuales).
- Evita todos los tipos de viñetas, si fuera útil/necesario poner algo por el estilo, hazlo manual, es decir usando guiones o números, ya que las viñetas obstruyen el formato Markdown.
- Organiza el contenido en secciones bien separadas, tipo ficha de análisis.
- Integra las explicaciones de manera fluida dentro de cada sección.
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
  const system = "Eres AuraLearn, un asistente experto en desarrollo profesional impulsado por inteligencia artificial. Tu objetivo es ayudar al usuario a alcanzar sus metas profesionales mediante un análisis completo de su perfil y la creación de un plan de capacitación personalizado. A partir del currículum del usuario, su puesto objetivo y sus preferencias de aprendizaje, deberás analizar, comparar y proponer rutas reales de crecimiento.";
  const user = `A continuación te proporciono el perfil del usuario en formato JSON, junto con el puesto objetivo y sus preferencias de aprendizaje. Realiza el análisis y recomendaciones siguiendo este esquema:\n
${JSON.stringify(profile)}
\n
## Tu misión principal
1. Analizar el CV completo del usuario (formación, experiencia, certificaciones, proyectos, habilidades, idiomas, etc.).
2. Identificar el puesto deseado y entender las competencias, habilidades técnicas y conocimientos requeridos para alcanzarlo.
3. Comparar el perfil actual con el perfil ideal, detectando brechas clave.
4. Generar un plan de capacitación estructurado (por etapas o meses) que ayude al usuario a cerrar esas brechas.
5. Recomendar cursos reales y actualizados en línea, en el idioma y formato que el usuario prefiera.
6. Entregar un reporte final claro y profesional, que sirva como guía práctica de desarrollo.

## Estructura del análisis

### 1. Resumen del CV
Escribe un breve resumen del usuario en forma de párrafo para captar de manera rápida quién es la persona que se está evaluando, cuál es su background, habilidades y competencias, etc, teniendo en cuenta la información proporcionada.

### 2. Competencias, habilidades y conocimientos
Evalúa el perfil en cinco dimensiones:
a. Competencias estratégicas: Capacidad de planificar, liderar, resolver problemas y tomar decisiones.
b. Habilidades técnicas (hard skills): Manejo de tecnologías, metodologías, herramientas y procesos específicos del área profesional.
c. Habilidades blandas (soft skills): Comunicación, trabajo en equipo, adaptabilidad, liderazgo y organización.
d. Conocimientos clave: Dominios teóricos y conceptuales relevantes para su área.
e. Competencias interpersonales y de gestión: Relación con colegas, empatía, influencia, gestión de conflictos.
Para cada dimensión, señala brevemente el nivel estimado (Básico / Intermedio / Avanzado) y explica de forma natural cómo se infiere del CV.

### 3. Roles meta y trayectorias posibles
Además del puesto deseado, sugiere tres roles alternativos o intermedios a los que el usuario podría aspirar según su perfil. Incluye una breve explicación de por qué cada uno es viable o útil en su desarrollo profesional.

### 4. Brechas principales y áreas de mejora
Identifica y clasifica las brechas entre el perfil actual y el perfil objetivo:
- Competencias a reforzar
- Habilidades técnicas que debe adquirir o actualizar
- Conocimientos que requieren consolidación
Asigna prioridad (Alta / Media / Baja) a cada brecha según su impacto en el objetivo profesional.

### 5. Plan de capacitación (3 meses sugeridos)
Organiza una ruta de aprendizaje por fases, con metas claras y actividades concretas:
Mes 1 – Foco inicial (por ejemplo, adquisición de nuevas habilidades técnicas).
Mes 2 – Profundización (por ejemplo, mejora de habilidades interpersonales o gestión).
Mes 3 – Aplicación práctica (por ejemplo, participación en proyectos reales o simulaciones).
Incluye métodos sugeridos: cursos en línea, presenciales o híbridos dependiendo de la opción seleccionada y las recomendaciones, proyectos o prácticas, autoevaluaciones, participación en comunidades.

### 6. Cursos y recursos reales recomendados
Para cada competencia o habilidad clave que deba desarrollar, busca cursos reales disponibles en línea. Cada curso debe incluir:
- Nombre del curso
- Plataforma o institución
- Descripción breve
- Idioma
- Enlace directo
- Duración estimada
- Motivo de la recomendación (cómo contribuye a cerrar una brecha específica)
Prefiere plataformas reconocidas como Coursera, Udemy, edX, LinkedIn Learning o Platzi. Asegúrate de que los cursos coincidan con los parámetros de aprendizaje del usuario (idioma, duración, modalidad, costo).

### 7. Reporte final de desarrollo
El informe final debe estar estructurado y agradable a la vista, en formato Markdown, y contener:
Perfil resumido
Brechas detectadas: lista que muestre las áreas clave a mejorar con sus prioridades.
Ruta de aprendizaje: resumen del plan mes a mes o por fases.
Cursos recomendados: listado limpio con enlaces y duración.
Indicadores de progreso: cómo sabrá el usuario que está avanzando (por ejemplo: finalizar cursos, aplicar en proyectos, mejorar en autoevaluaciones, etc.).
Recomendaciones adicionales: lecturas, comunidades, certificaciones o prácticas que potencien su crecimiento.

## Estilo y tono
- Usa un lenguaje profesional, accesible y motivador.
- Presenta la información con espaciado y encabezados claros.
- Evita listas numeradas automáticas (usa encabezados o manuales).
- Evita todos los tipos de viñetas, si fuera útil/necesario poner algo por el estilo, hazlo manual, es decir usando guiones o números, ya que las viñetas obstruyen el formato Markdown.
- Organiza el contenido en secciones bien separadas, tipo ficha de análisis.
- Integra las explicaciones de manera fluida dentro de cada sección.
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
