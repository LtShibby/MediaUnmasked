// Remove unused API_URL since we're using mock data
export interface AnalysisResponse {
  headline: string;
  content: string;
  sentiment: string;
  bias: string;
  confidence_score: number;
  flagged_phrases: string[];
}

export const analyzeArticle = async (_url: string): Promise<AnalysisResponse> => {
  // Added underscore to url parameter to indicate it's intentionally unused
  return {
    headline: "Sample Article",
    content: "This is a sample article content for testing the frontend deployment.",
    sentiment: "Neutral",
    bias: "Neutral",
    confidence_score: 0.5,
    flagged_phrases: ["sample phrase"]
  };
}; 