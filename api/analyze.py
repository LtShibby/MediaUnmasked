from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Any
import os
import sys
from bs4 import BeautifulSoup
import requests
import logging

# Add the src directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))
from mediaunmasked.analyzers.scoring import MediaScorer

# Initialize FastAPI app
app = FastAPI()
scorer = MediaScorer()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/")
async def root():
    return {"message": "API is working"}

class ArticleRequest(BaseModel):
    url: HttpUrl

class AnalysisResponse(BaseModel):
    headline: str
    content: str
    sentiment: str
    bias: str
    confidence_score: float
    flagged_phrases: List[str]
    media_score: Dict[str, Any]

def scrape_article(url: str) -> dict:
    try:
        logger.info(f"Starting to scrape URL: {url}")
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        headline = soup.find('h1').text if soup.find('h1') else "No headline found"
        content = ' '.join([p.text for p in soup.find_all('p')])
        
        logger.info(f"Successfully scraped article. Headline length: {len(headline)}, Content length: {len(content)}")
        return {
            "headline": headline,
            "content": content
        }
    except Exception as e:
        logger.error(f"Failed to scrape article: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Failed to scrape article: {str(e)}")

@app.post("/analyze")
async def analyze_article(request: ArticleRequest):
    try:
        logger.info(f"Received request to analyze URL: {request.url}")
        
        # Scrape article
        article = scrape_article(str(request.url))
        logger.info(f"Successfully scraped article with headline: {article['headline'][:50]}...")
        
        # Use the real scoring algorithm
        analysis = scorer.calculate_media_score(article["headline"], article["content"])
        logger.info(f"Analysis completed with score: {analysis['media_unmasked_score']}")
        
        response = AnalysisResponse(
            headline=article["headline"],
            content=article["content"],
            sentiment=analysis["details"]["sentiment_analysis"]["sentiment"],
            bias=analysis["details"]["bias_analysis"]["bias"],
            confidence_score=analysis["details"]["bias_analysis"]["confidence_score"],
            flagged_phrases=analysis["details"]["sentiment_analysis"]["flagged_phrases"],
            media_score=analysis
        )
        
        # Log the response
        logger.info("Preparing response with data:")
        logger.info(f"Headline: {response.headline[:50]}...")
        logger.info(f"Media Score: {response.media_score['media_unmasked_score']}")
        logger.info(f"Rating: {response.media_score['rating']}")
        
        return response
    except Exception as e:
        logger.error(f"Error analyzing article: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=400,
            detail=f"Error analyzing article: {str(e)}"
        ) 