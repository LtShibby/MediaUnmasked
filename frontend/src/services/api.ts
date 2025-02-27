const API_URL = import.meta.env.PROD
  ? 'https://wozwize-media-unmasked-api.hf.space'  // Use your Hugging Face deployed backend in production
  : 'http://localhost:7860'; // Development API path


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
    bias_score: number;
    bias_percentage: number;
  };
  evidence_analysis: {
    evidence_based_score: number;
  };
}

export interface MediaScore {
  media_unmasked_score: number;
  rating: string;
  details: {
    headline_analysis: {
      headline_vs_content_score: number;
      contradictory_phrases: string[];
    };
    evidence_analysis: {
      evidence_based_score: number;
      flagged_phrases: string[];
    };
    sentiment_analysis: {
      manipulation_score: number;
      flagged_phrases: string[];
    };
    bias_analysis: {
      bias: string;
      bias_score: number;
      bias_percentage: number;
    };
  };
}

export interface AnalysisResponse {
  headline: string;
  content: string;
  sentiment: string;
  bias: string;
  bias_score: number;
  bias_percentage: number;
  flagged_phrases: string[];
  media_score: MediaScore;
}

export const analyzeArticle = async (url: string, useAI: boolean = false): Promise<AnalysisResponse> => {
  try {
    console.log('Sending request to:', `${API_URL}/api/analyze`);
    console.log('Analysis mode:', useAI ? 'AI-Powered' : 'Traditional');
    
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify({ url, use_ai: useAI }),
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