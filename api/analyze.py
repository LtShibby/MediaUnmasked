from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Dict, Any
import logging
import sys
import os

# Add the src directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from mediaunmasked.scrapers.article_scraper import ArticleScraper
from mediaunmasked.analyzers.scoring import MediaScorer

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
scraper = ArticleScraper()
scorer = MediaScorer()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Back to allowing all origins as it was working before
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ArticleRequest(BaseModel):
    url: HttpUrl

@app.get("/")
async def root():
    return {"message": "API is working"}

@app.post("/api/analyze")
async def analyze_article(request: ArticleRequest):
    try:
        logger.info(f"Received request to analyze URL: {request.url}")
        
        # Scrape the article
        article = scraper.scrape_article(str(request.url))
        if not article:
            raise HTTPException(
                status_code=400,
                detail="Failed to scrape article content"
            )
            
        logger.info(f"Successfully scraped article: {article['headline'][:50]}...")
        
        # Analyze the content using our scoring algorithm
        analysis = scorer.calculate_media_score(article['headline'], article['content'])
        logger.info(f"Analysis complete with score: {analysis['media_unmasked_score']}")
        
        # Construct response
        response = {
            "headline": article['headline'],
            "content": article['content'],
            "sentiment": analysis['details']['sentiment_analysis']['sentiment'],
            "bias": analysis['details']['bias_analysis']['bias'],
            "confidence_score": analysis['details']['bias_analysis']['confidence_score'],
            "flagged_phrases": analysis['details']['sentiment_analysis']['flagged_phrases'],
            "media_score": analysis
        }
        
        logger.info("Returning analysis results")
        return response
        
    except Exception as e:
        logger.error(f"Error in analyze endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        ) 