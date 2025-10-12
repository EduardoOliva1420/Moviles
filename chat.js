import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // puedes usar "gpt-5" o "gpt-4o" según disponibilidad
    messages: [
      { role: "system", content: "Eres un asistente útil y amable." },
      { role: "user", content: "Explícame cómo funciona la API de OpenAI." },
    ],
  });

  console.log(response.choices[0].message.content);
}

main();
