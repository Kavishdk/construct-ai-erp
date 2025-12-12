import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || ''; // Use env var safely on backend
const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
  async analyzeProjectHealth(projectSummary: any, riskData: any): Promise<string> {
    if (!apiKey) return "Gemini API Key is missing on Server.";

    const model = "gemini-2.0-flash";
    const prompt = `
      You are an expert AI Construction Finance Analyst. 
      Analyze the following project status and risk data. Provide a concise, 3-sentence executive summary 
      explaining WHY the risk level is what it is and suggest ONE actionable mitigation step.

      Data:
      Project Name: ${projectSummary.name}
      Budget: $${projectSummary.budget}
      Actual Cost: $${projectSummary.actualCost}
      Progress: ${projectSummary.progress}%
      Status: ${projectSummary.status}
      Calculated Risk Score: ${riskData.riskScore}
      Risk Level: ${riskData.riskLevel}
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      return response.text || "Could not generate analysis.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Unable to retrieve AI insights.";
    }
  },

  async forecastCashFlow(dataStr: string): Promise<string> {
    if (!apiKey) return "API Key missing.";
    
    const prompt = `
      Based on the following last 6 months of cash flow data, provide a brief forecast for next month.
      Mention if the trend is positive or negative.
      
      Data:
      ${dataStr}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      return response.text || "Forecast unavailable.";
    } catch (error) {
      return "Error generating forecast.";
    }
  }
};
