import pytest
from mediaunmasked.scrapers.article_scraper import ArticleScraper

def test_snopes_article():
    scraper = ArticleScraper()
    url = "https://www.snopes.com/fact-check/biden-border-crisis/"
    result = scraper.scrape_article(url)
    
    assert result is not None
    assert "headline" in result
    assert "content" in result
    assert len(result["headline"]) > 0
    assert len(result["content"]) > 0

def test_politifact_article():
    scraper = ArticleScraper()
    url = "https://www.politifact.com/factchecks/2024/"
    result = scraper.scrape_article(url)
    
    assert result is not None
    assert "headline" in result
    assert "content" in result
    assert len(result["headline"]) > 0
    assert len(result["content"]) > 0

def test_invalid_url():
    scraper = ArticleScraper()
    result = scraper.scrape_article("https://invalid-url-that-doesnt-exist.com")
    assert result is None

def test_snopes_article_structure():
    scraper = ArticleScraper()
    url = "https://www.snopes.com/news/2024/02/12/super-bowl-halftime-show/"
    result = scraper.scrape_article(url)
    
    assert result is not None
    assert isinstance(result, dict)
    assert set(result.keys()) == {"headline", "content"}
    assert isinstance(result["headline"], str)
    assert isinstance(result["content"], str) 