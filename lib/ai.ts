import { GoogleGenerativeAI } from "@google/generative-ai";

// Inizializzazione del client Gemini
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * MODELLO TESTUALE (per spiegazioni, diagnosi, consigli)
 */
export async function askGeminiText(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response;
  } catch (err) {
    console.error("Gemini TEXT error:", err);
    return "Errore nella generazione della risposta testuale.";
  }
}

/**
 * MODELLO IMMAGE → ANALISI FOGLIE, MALATTIE, PARASSITI
 * Accetta: base64Image senza prefisso
 */
export async function askGeminiVision(prompt: string, base64Image: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
      { text: prompt }
    ]);

    return result.response.text();
  } catch (err) {
    console.error("Gemini VISION error:", err);
    return "Errore nell'analisi dell'immagine.";
  }
}

/**
 * FUNZIONE GENERALE
 * Sceglie automaticamente se usare testo o immagine
 */
export async function askAI({
  prompt,
  imageBase64,
}: {
  prompt: string;
  imageBase64?: string;
}): Promise<string> {
  if (imageBase64) {
    return await askGeminiVision(prompt, imageBase64);
  }

  return await askGeminiText(prompt);
}
