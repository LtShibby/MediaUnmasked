from src.mediaunmasked.analyzers.headline_analyzer import HeadlineAnalyzer
from src.mediaunmasked.utils.logging_config import setup_logging
import logging

def main():
    # Set up logging
    setup_logging()
    logger = logging.getLogger(__name__)

    # Initialize analyzer
    analyzer = HeadlineAnalyzer()

    # Test cases
    test_cases = [
        {
            "headline": "New Study Shows Coffee Reduces Heart Disease Risk",
            "content": "Recent research suggests that coffee may have cardiovascular benefits, according to scientists."
        },
        {
            "headline": "Coffee Shown to Increase Heart Disease Risk",
            "content": "Recent studies indicate that coffee consumption may actually decrease the risk of cardiovascular disease."
        },
        {
            "headline": "Scientists Study Coffee's Effects on Health",
            "content": "Researchers are conducting various studies on beverages and their impact on human health."
        }
    ]

    # Run analysis for each test case
    for case in test_cases:
        logger.info(f"\nAnalyzing headline: {case['headline']}")
        result = analyzer.analyze(case['headline'], case['content'])
        print(f"\nResults for: {case['headline']}")
        print(f"Headline vs Content Score: {result['headline_vs_content_score']}%")
        print(f"Entailment Score: {result['entailment_score']}")
        print(f"Contradiction Score: {result['contradiction_score']}")
        print("-" * 80)

if __name__ == "__main__":
    main() 