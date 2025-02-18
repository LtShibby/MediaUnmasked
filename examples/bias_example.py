from mediaunmasked.analyzers.bias_analyzer import BiasAnalyzer
from mediaunmasked.scrapers.article_scraper import ArticleScraper
from mediaunmasked.utils.logging_config import setup_logging

def main():
    # Set up logging
    setup_logging()
    
    # Initialize scrapers and analyzers
    scraper = ArticleScraper()
    analyzer = BiasAnalyzer()
    
    # Scrape an article
    url = "https://www.snopes.com/articles/469232/musk-son-told-trump-shut-up/"
    article = scraper.scrape_article(url)
    
    if article:
        # Analyze the content
        result = analyzer.analyze(article['content'])
        
        # Print results
        print(f"Article: {article['headline']}\n")
        print(f"Sentiment: {result.sentiment}")

        print(f"Bias: {result.bias}")
        print(f"Confidence Score: {result.confidence_score}%")
        print("\nFlagged Phrases:")
        for phrase in result.flagged_phrases:
            print(f"- {phrase}")

if __name__ == "__main__":
    main()