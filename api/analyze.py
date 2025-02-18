from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List
import os
import sys

# Add the src directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from mediaunmasked.analyzers.bias_analyzer import BiasAnalyzer
from mediaunmasked.scrapers.article_scraper import ArticleScraper

app = FastAPI()

# Enable CORS
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
]

if production_domain := os.getenv("VERCEL_URL"):
    ALLOWED_ORIGINS.append(f"https://{production_domain}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize analyzers
scraper = ArticleScraper()
analyzer = BiasAnalyzer()

class ArticleRequest(BaseModel):
    url: HttpUrl

class AnalysisResponse(BaseModel):
    headline: str
    content: str
    sentiment: str
    bias: str
    confidence_score: float
    flagged_phrases: List[str]

@app.post("/api/analyze")
async def analyze_article(request: ArticleRequest):
    try:
        article = scraper.scrape_article(str(request.url))
        if not article:
            raise HTTPException(
                status_code=400,
                detail="Failed to fetch article. Please check if the URL is valid and accessible."
            )
        
        result = analyzer.analyze(article['content'])
        
        return AnalysisResponse(
            headline=article['headline'],
            content=article['content'],
            sentiment=result.sentiment,
            bias=result.bias,
            confidence_score=result.confidence_score,
            flagged_phrases=result.flagged_phrases
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error analyzing article: {str(e)}"
        ) 