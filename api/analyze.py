from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Any
import os
import sys
from bs4 import BeautifulSoup
import requests
import logging

# Add src directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))
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
    media_score: Dict[str, Any] = {
        "media_unmasked_score": float,
        "rating": str,
        "details": {
            "headline_analysis": {
                "headline_vs_content_score": float,
                "contradictory_phrases": List[str]
            },
            "sentiment_analysis": {
                "sentiment": str,
                "manipulation_score": float,
                "flagged_phrases": List[str]
            },
            "bias_analysis": {
                "bias": str,
                "confidence_score": float
            },
            "evidence_analysis": {
                "evidence_based_score": float
            }
        }
    }

def scrape_article(url: str) -> dict:
    try:
        logger.info(f"Starting to scrape URL: {url}")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Try multiple heading tags
        headline = None
        for tag in ['h1', 'h2', '.headline', '.article-title']:
            if soup.select_one(tag):
                headline = soup.select_one(tag).text.strip()
                break
        
        if not headline:
            headline = "No headline found"
            
        # Get paragraphs, excluding common non-content areas
        content_paragraphs = []
        for p in soup.find_all('p'):
            # Skip if parent is likely a comment section or sidebar
            parent_classes = p.parent.get('class', [])
            if not any(x in ' '.join(parent_classes) for x in ['comment', 'sidebar', 'footer', 'nav']):
                content_paragraphs.append(p.text.strip())
        
        content = ' '.join(content_paragraphs)
        
        if not content:
            raise ValueError("No article content found")
            
        logger.info(f"Successfully scraped article. Headline length: {len(headline)}, Content length: {len(content)}")
        return {
            "headline": headline,
            "content": content
        }
    except requests.RequestException as e:
        logger.error(f"Request failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Failed to fetch article: {str(e)}")
    except Exception as e:
        logger.error(f"Failed to scrape article: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Failed to parse article: {str(e)}")

@app.post("/analyze")
async def analyze_article(request: ArticleRequest):
    try:
        logger.info(f"Received request to analyze URL: {request.url}")
        
        try:
            # Scrape article
            article = scrape_article(str(request.url))
            logger.info(f"Successfully scraped article with headline: {article['headline'][:50]}...")
        except Exception as scrape_error:
            logger.error(f"Scraping error: {str(scrape_error)}", exc_info=True)
            raise HTTPException(status_code=400, detail=f"Failed to scrape article: {str(scrape_error)}")
        
        try:
            # Get full analysis using the scoring algorithm
            analysis = scorer.calculate_media_score(article["headline"], article["content"])
            logger.info(f"Analysis completed with score: {analysis['media_unmasked_score']}")
        except Exception as scoring_error:
            logger.error(f"Scoring error: {str(scoring_error)}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error in analysis: {str(scoring_error)}")
        
        try:
            # Create response with all analysis details
            response = AnalysisResponse(
                headline=article["headline"],
                content=article["content"],
                sentiment=analysis["details"]["sentiment_analysis"]["sentiment"],
                bias=analysis["details"]["bias_analysis"]["bias"],
                confidence_score=analysis["details"]["bias_analysis"]["confidence_score"],
                flagged_phrases=analysis["details"]["sentiment_analysis"]["flagged_phrases"],
                media_score={
                    "media_unmasked_score": analysis["media_unmasked_score"],
                    "rating": analysis["rating"],
                    "details": {
                        "headline_analysis": {
                            "headline_vs_content_score": analysis["details"]["headline_analysis"]["headline_vs_content_score"],
                            "contradictory_phrases": analysis["details"]["headline_analysis"]["contradictory_phrases"]
                        },
                        "sentiment_analysis": {
                            "sentiment": analysis["details"]["sentiment_analysis"]["sentiment"],
                            "manipulation_score": analysis["details"]["sentiment_analysis"]["manipulation_score"],
                            "flagged_phrases": analysis["details"]["sentiment_analysis"]["flagged_phrases"]
                        },
                        "bias_analysis": {
                            "bias": analysis["details"]["bias_analysis"]["bias"],
                            "confidence_score": analysis["details"]["bias_analysis"]["confidence_score"]
                        },
                        "evidence_analysis": {
                            "evidence_based_score": analysis["details"]["evidence_analysis"]["evidence_based_score"]
                        }
                    }
                }
            )
            
            # Log response details
            logger.info("Preparing response with data:")
            logger.info(f"Headline: {response.headline[:50]}...")
            logger.info(f"Media Score: {response.media_score['media_unmasked_score']}")
            logger.info(f"Rating: {response.media_score['rating']}")
            logger.info(f"Bias: {response.media_score['details']['bias_analysis']['bias']}")
            
            return response
            
        except Exception as response_error:
            logger.error(f"Response creation error: {str(response_error)}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error creating response: {str(response_error)}")
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        ) 