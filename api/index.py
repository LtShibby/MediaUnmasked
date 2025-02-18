from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from analyze import analyze_article, ArticleRequest
import os

app = FastAPI()

# Get allowed origins from environment or use defaults
ALLOWED_ORIGINS = [
    "http://localhost:5176",  # Add your current Vite dev server port
    "http://localhost:5173",
    "http://localhost:3000",
    "https://mediaunmask.com",
]

# Add Vercel URL if in production
if vercel_url := os.getenv("VERCEL_URL"):
    ALLOWED_ORIGINS.append(f"https://{vercel_url}")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,  # Changed to False since we're not using credentials
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)

@app.options("/api/analyze")
async def analyze_options():
    return {}  # Handle OPTIONS preflight request

@app.post("/api/analyze")
async def analyze_endpoint(request: ArticleRequest):
    return await analyze_article(request)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# This is needed for Vercel
handler = app 