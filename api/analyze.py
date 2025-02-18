from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List
import os
import requests
from bs4 import BeautifulSoup

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

class ArticleRequest(BaseModel):
    url: HttpUrl

class AnalysisResponse(BaseModel):
    headline: str
    content: str
    sentiment: str = "Neutral"  # Placeholder
    bias: str = "Neutral"       # Placeholder
    confidence_score: float = 0.5
    flagged_phrases: List[str] = []

def scrape_article(url: str) -> dict:
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Basic scraping logic
        headline = soup.find('h1').text if soup.find('h1') else "No headline found"
        content = ' '.join([p.text for p in soup.find_all('p')])
        
        return {
            "headline": headline,
            "content": content
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to scrape article: {str(e)}")

@app.post("/api/analyze")
async def analyze_article(request: ArticleRequest):
    try:
        article = scrape_article(str(request.url))
        
        # For now, return placeholder analysis
        return AnalysisResponse(
            headline=article["headline"],
            content=article["content"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error analyzing article: {str(e)}"
        ) 