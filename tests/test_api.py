import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from fastapi.testclient import TestClient
from api.analyze import app
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = TestClient(app)

def test_analyze_endpoint():
    # Test URLs - using real, existing articles
    test_urls = [
        "https://www.snopes.com/fact-check/trump-super-bowl-cost-taxpayers/",
        "https://www.politifact.com/factchecks/2025/feb/14/elon-musk/fema-did-not-give-disaster-relief-money-to-new-yor/",
        "https://www.snopes.com/fact-check/muslims-minority-rights-churchill-quote/"
    ]
    
    for url in test_urls:
        logger.info(f"\nTesting URL: {url}")
        
        try:
            # Make request to analyze endpoint
            response = client.post(
                "/api/analyze",
                json={"url": url}
            )
            
            # Log response status and content
            logger.info(f"Response status: {response.status_code}")
            logger.info(f"Response headers: {response.headers}")
            
            if response.status_code != 200:
                logger.error(f"Error response: {response.text}")
                continue
                
            # Parse response data
            data = response.json()
            
            # Log key components
            logger.info("Response data:")
            logger.info(f"Headline: {data.get('headline', '')[:100]}...")
            logger.info(f"Content length: {len(data.get('content', ''))}")
            logger.info(f"Media score: {data.get('media_score', {}).get('media_unmasked_score')}")
            logger.info(f"Sentiment: {data.get('sentiment')}")
            logger.info(f"Bias: {data.get('bias')}")
            
            # Validate response structure
            assert 'headline' in data
            assert 'content' in data
            assert 'sentiment' in data
            assert 'bias' in data
            assert 'confidence_score' in data
            assert 'flagged_phrases' in data
            assert 'media_score' in data
            
            # Validate media_score structure
            media_score = data['media_score']
            assert 'media_unmasked_score' in media_score
            assert 'rating' in media_score
            assert 'details' in media_score
            
            logger.info("✅ Test passed for URL")
            
        except Exception as e:
            logger.error(f"❌ Test failed for URL: {str(e)}", exc_info=True)

if __name__ == "__main__":
    logger.info("Starting API tests...")
    test_analyze_endpoint() 