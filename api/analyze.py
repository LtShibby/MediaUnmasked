from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List
import os
import sys
from bs4 import BeautifulSoup
import requests

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api")
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

def scrape_article(url: str) -> dict:
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
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
        
        # For now, return simplified analysis
        return AnalysisResponse(
            headline=article["headline"],
            content=article["content"],
            sentiment="Neutral",
            bias="Neutral",
            confidence_score=0.5,
            flagged_phrases=[]
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error analyzing article: {str(e)}"
        ) 