import { Project, RiskAnalysis } from "../types";

// Helper to get token (simulated or from localStorage in real app)
const getToken = () => localStorage.getItem('token');

export const GeminiService = {
  /**
   * Generates a natural language summary of the project's financial health via Backend API.
   */
  async analyzeProjectHealth(project: Project, risk: RiskAnalysis): Promise<string> {
    try {
      const response = await fetch(`/api/projects/${project.id}/insight`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch insight');
      const data = await response.json();
      return data.insight;
    } catch (error) {
      console.error("AI Service Error:", error);
      return "Unable to retrieve AI insights (Backend connection failed).";
    }
  },

  /**
   * Generates a cash flow forecast explanation based on historical trends via Backend API.
   */
  async forecastCashFlow(recentMonthsData: {month: string, cashIn: number, cashOut: number}[]): Promise<string> {
    // Note: We need to implement the backend endpoint for this too.
    // For now returning a placeholder or calling a generic finance endpoint
    return "Forecast feature moving to backend...";
  }
};
