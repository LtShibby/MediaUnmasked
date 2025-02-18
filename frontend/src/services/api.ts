const API_URL = 'https://mockapi.example.com';  // We'll update this later

export interface AnalysisResponse {
  headline: string;
  content: string;
  sentiment: string;
  bias: string;
  confidence_score: number;
  flagged_phrases: string[];
}

export const analyzeArticle = async (url: string): Promise<AnalysisResponse> => {
  // Return mock data for now
  return {
    headline: "Sample Article",
    content: "This is a sample article content for testing the frontend deployment.",
    sentiment: "Neutral",
    bias: "Neutral",
    confidence_score: 0.5,
    flagged_phrases: ["sample phrase"]
  };
}; 