from mediaunmasked.scrapers.article_scraper import ArticleScraper
from mediaunmasked.utils.logging_config import setup_logging

def main():
    # Set up logging
    setup_logging()
    
    scraper = ArticleScraper()
    url = "https://www.snopes.com/news/2025/02/12/trump-super-bowl-cost-taxpayers/"
    result = scraper.scrape_article(url)
    
    if result is None:
        print(f"Failed to scrape article from {url}")
        return
        
    print("Headline:", result["headline"])
    print("\nContent:", result["content"][:500], "...")

if __name__ == "__main__":
    main() 