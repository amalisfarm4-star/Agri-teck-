import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { image, language } = await req.json();

    const prompt = `Analyze this agricultural image. Identify diseases, pests, or nutrient deficiencies. Language: ${language}. Return JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            severity: { type: Type.STRING, enum: ["low", "medium", "high"] }
          }
        }
      }
    });

    return NextResponse.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    return NextResponse.json({ error: "AI Processing Failed" }, { status: 500 });
  }
}