from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Dict, Any
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ArticleRequest(BaseModel):
    url: HttpUrl

@app.get("/")
async def root():
    return {"message": "API is working"}

@app.post("/analyze")
async def analyze_article(request: ArticleRequest):
    try:
        logger.info(f"Received request to analyze URL: {request.url}")
        
        # Return a simple mock response
        mock_response = {
            "headline": "Test Headline",
            "content": "Test content",
            "sentiment": "Neutral",
            "bias": "Neutral",
            "confidence_score": 0.75,
            "flagged_phrases": ["test phrase"],
            "media_score": {
                "media_unmasked_score": 75.5,
                "rating": "Some Bias Present",
                "details": {
                    "headline_analysis": {
                        "headline_vs_content_score": 20,
                        "contradictory_phrases": ["Sample contradiction"]
                    },
                    "sentiment_analysis": {
                        "sentiment": "Neutral",
                        "manipulation_score": 30,
                        "flagged_phrases": ["Sample manipulative phrase"]
                    },
                    "bias_analysis": {
                        "bias": "Neutral",
                        "confidence_score": 0.75
                    },
                    "evidence_analysis": {
                        "evidence_based_score": 80
                    }
                }
            }
        }
        
        logger.info("Returning mock response")
        return mock_response
        
    except Exception as e:
        logger.error(f"Error in analyze endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={"error": f"Analysis failed: {str(e)}"}
        ) 