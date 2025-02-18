const API_URL = import.meta.env.PROD 
  ? window.location.origin  // Use the same domain as frontend in production
  : 'http://localhost:8000'; // Development API path

export interface MediaScoreDetails {
  headline_analysis: {
    headline_vs_content_score: number;
    contradictory_phrases: string[];
  };
  sentiment_analysis: {
    sentiment: string;
    manipulation_score: number;
    flagged_phrases: string[];
  };
  bias_analysis: {
    bias: string;
    confidence_score: number;
  };
  evidence_analysis: {
    evidence_based_score: number;
  };
}

export interface MediaScore {
  media_unmasked_score: number;
  rating: string;
  details: MediaScoreDetails;
}

export interface AnalysisResponse {
  headline: string;
  content: string;
  sentiment: string;
  bias: string;
  confidence_score: number;
  flagged_phrases: string[];
  media_score: MediaScore;
}

export const analyzeArticle = async (url: string): Promise<AnalysisResponse> => {
  try {
    console.log('Sending request to:', `${API_URL}/api/analyze`);
    
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify({ url }),
    });

    const contentType = response.headers.get('content-type');
    console.log('Response content type:', contentType);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text);
      
      let errorMessage: string;
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.detail || 'Failed to analyze article';
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        errorMessage = text || 'Failed to analyze article';
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('Full error object:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
      throw new Error(`Analysis failed: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
}; 