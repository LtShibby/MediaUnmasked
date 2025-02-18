const API_URL = import.meta.env.PROD 
  ? window.location.origin  // Use the same domain as frontend in production
  : 'http://localhost:8000'; // Development API path

export interface AnalysisResponse {
  headline: string;
  content: string;
  sentiment: string;
  bias: string;
  confidence_score: number;
  flagged_phrases: string[];
}

export const analyzeArticle = async (url: string): Promise<AnalysisResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/analyze`, {  // Add /api prefix
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to analyze article');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Analysis failed: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
}; 