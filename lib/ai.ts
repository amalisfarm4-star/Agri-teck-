import { GoogleGenAI, Type } from "@google/genai";
import { 
  AIAnalysisResult, 
  Invoice, 
  AIGeneratedListing, 
  AIInsight, 
  SimulationResult,
  BusinessPlanData 
} from '../types';

// Singleton AI Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_FLASH = 'gemini-2.5-flash';
const MODEL_PRO = 'gemini-3-pro-preview';

/**
 * AI CORE: Centralized functions for all modules
 */

export const AICore = {
  
  // 1. VISION AI: Crop Disease Diagnosis
  async analyzeCropImage(base64Image: string, language: string): Promise<AIAnalysisResult> {
    const prompt = `Analyze this agricultural crop image. Identify diseases, pests, or nutrient deficiencies. 
    Language: ${language}. Return JSON with diagnosis, confidence, recommendations array, and severity.`;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
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
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("AI Vision Error", e);
      throw new Error("Analysis failed");
    }
  },

  // 2. ACCOUNTING: OCR Invoice Extraction
  async extractInvoiceData(base64Image: string): Promise<Partial<Invoice>> {
    const prompt = `Extract invoice data. Return JSON: supplier, date (YYYY-MM-DD), amount, items (array string).`;
    try {
      const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              supplier: { type: Type.STRING },
              date: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              items: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("AI OCR Error", e);
      throw new Error("OCR failed");
    }
  },

  // 3. MARKETPLACE: Auto-Listing Generation
  async optimizeListing(input: string, language: string): Promise<AIGeneratedListing> {
    const prompt = `Create a professional agricultural marketplace listing from: "${input}". 
    Language: ${language}. Return JSON: title, description, category (machinery/produce/inputs/services), suggestedPrice, tags.`;
    
    try {
      const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING, enum: ["machinery", "produce", "inputs", "services"] },
              suggestedPrice: { type: Type.NUMBER },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) { return { title: "Error", description: input, category: "produce", suggestedPrice: 0, tags: [] }; }
  },

  // 4. DIGITAL TWIN: 72h Simulation
  async runSimulation(sensors: any, weather: any, hours: number): Promise<SimulationResult> {
    const prompt = `Simulate crop status for next ${hours}h based on sensors: ${JSON.stringify(sensors)} and weather: ${JSON.stringify(weather)}.
    Predict health (0-100), risk (0-100), moisture, and advice. Return JSON.`;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              timestamp: { type: Type.STRING },
              overallHealth: { type: Type.NUMBER },
              riskFactor: { type: Type.NUMBER },
              predictedMoisture: { type: Type.NUMBER },
              advice: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) { throw new Error("Simulation failed"); }
  },

  // 5. DASHBOARD: Strategic Insights
  async generateInsights(data: any, language: string): Promise<AIInsight[]> {
    const prompt = `Analyze farm data: ${JSON.stringify(data)}. Provide 3 strategic insights (opportunity/risk/optimization). Language: ${language}. Return JSON array.`;
    try {
      const response = await ai.models.generateContent({
        model: MODEL_PRO,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['opportunity', 'risk', 'optimization'] },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    } catch (e) { return []; }
  },

  // 6. IRRIGATION: Optimization
  async optimizeIrrigation(zone: any, weather: any, language: string) {
    const prompt = `Zone: ${JSON.stringify(zone)}. Weather: ${JSON.stringify(weather)}. Should we water? Language: ${language}. JSON: adjustment (string), reason, savings (number).`;
    try {
        const response = await ai.models.generateContent({
            model: MODEL_FLASH,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        adjustment: { type: Type.STRING },
                        reason: { type: Type.STRING },
                        savings: { type: Type.NUMBER }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) { return { adjustment: "Error", reason: "AI Offline", savings: 0 }; }
  },

  // 7. GRANTS: Business Plan Generator
  async generateBusinessPlan(data: BusinessPlanData, language: string): Promise<{ text: string }> {
      const prompt = `Write a grant business plan for: ${JSON.stringify(data)}. Language: ${language}. Return plain text.`;
      const response = await ai.models.generateContent({
          model: MODEL_PRO,
          contents: prompt
      });
      return { text: response.text || "" };
  },

  // 8. NOTIFICATIONS: Predictive Alerts
  async predictAlerts(systemState: any, language: string) {
      const prompt = `Analyze system state: ${JSON.stringify(systemState)}. Predict immediate risks. Language: ${language}. Return JSON array of alerts.`;
      try {
        const response = await ai.models.generateContent({
            model: MODEL_FLASH,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            message: { type: Type.STRING },
                            priority: { type: Type.STRING, enum: ['critical', 'high', 'medium', 'low'] },
                            type: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text || "[]");
      } catch (e) { return []; }
  }
};