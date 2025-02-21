import unittest
import logging
from src.mediaunmasked.analyzers.headline_analyzer import HeadlineAnalyzer
from src.mediaunmasked.utils.logging_config import setup_logging

class TestHeadlineAnalyzer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test class - runs once before all tests."""
        setup_logging()
        cls.logger = logging.getLogger(__name__)
        cls.analyzer = HeadlineAnalyzer()

    def test_matching_headline(self):
        """Test when headline matches content."""
        headline = "New Study Shows Coffee Reduces Heart Disease Risk"
        content = "Recent research suggests that coffee may have cardiovascular benefits, according to scientists."
        
        self.logger.info(f"Testing matching headline:\nHeadline: {headline}\nContent: {content}")
        result = self.analyzer.analyze(headline, content)
        
        self.assertIsInstance(result, dict)
        self.assertIn('headline_vs_content_score', result)
        self.assertIn('entailment_score', result)
        self.assertIn('contradiction_score', result)
        
        # Score should be above neutral for matching content
        self.assertGreater(result['headline_vs_content_score'], 30)
        # Should have low contradiction
        self.assertLess(result['contradiction_score'], 0.3)
        self.logger.info(f"Matching headline test result: {result}")

    def test_contradictory_headline(self):
        """Test when headline contradicts content."""
        headline = "Coffee Shown to Increase Heart Disease Risk"
        content = "Recent studies indicate that coffee consumption may actually decrease the risk of cardiovascular disease."
        
        self.logger.info(f"Testing contradictory headline:\nHeadline: {headline}\nContent: {content}")
        result = self.analyzer.analyze(headline, content)
        
        # Score should be lower for contradictory content
        self.assertLess(result['headline_vs_content_score'], 30)
        self.assertGreater(result['contradiction_score'], 0.3)
        self.logger.info(f"Contradictory headline test result: {result}")

    def test_neutral_headline(self):
        """Test when headline is neutral to content."""
        headline = "Scientists Study Coffee's Effects on Health"
        content = "Researchers are conducting various studies on beverages and their impact on human health."
        
        self.logger.info(f"Testing neutral headline:\nHeadline: {headline}\nContent: {content}")
        result = self.analyzer.analyze(headline, content)
        
        # Score should be moderate for neutral content
        self.assertGreater(result['headline_vs_content_score'], 40)
        self.assertLess(result['headline_vs_content_score'], 80)
        self.logger.info(f"Neutral headline test result: {result}")

    def test_error_handling(self):
        """Test error handling with invalid inputs."""
        result = self.analyzer.analyze("", "")  # Empty strings
        self.assertEqual(result['headline_vs_content_score'], 0)
        self.assertEqual(result['entailment_score'], 0)
        self.assertEqual(result['contradiction_score'], 0)

if __name__ == '__main__':
    unittest.main() 