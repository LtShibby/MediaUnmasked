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

        # Adjusted thresholds based on smaller models
        self.assertGreater(result['headline_vs_content_score'], 50)  # Should be clearly above neutral
        self.assertGreater(result['entailment_score'], 0.6)  # Should lean strongly towards entailment
        self.assertLess(result['contradiction_score'], 0.2)  # Low contradiction expected

        self.logger.info(f"Matching headline test result: {result}")

    def test_contradictory_headline(self):
        """Test when headline contradicts content."""
        headline = "Coffee Shown to Increase Heart Disease Risk"
        content = "Recent studies indicate that coffee consumption may actually decrease the risk of cardiovascular disease."
        
        self.logger.info(f"Testing contradictory headline:\nHeadline: {headline}\nContent: {content}")
        result = self.analyzer.analyze(headline, content)

        # Contradiction should be dominant
        self.assertLess(result['headline_vs_content_score'], 30)  # Should be low due to contradiction
        self.assertGreater(result['contradiction_score'], 0.7)  # Expect strong contradiction

        self.logger.info(f"Contradictory headline test result: {result}")

    def test_neutral_headline(self):
        """Test when headline is neutral to content."""
        headline = "Scientists Study Coffee's Effects on Health"
        content = "Researchers are conducting various studies on beverages and their impact on human health."
        
        self.logger.info(f"Testing neutral headline:\nHeadline: {headline}\nContent: {content}")
        result = self.analyzer.analyze(headline, content)

        # Should be within the neutral range
        self.assertGreater(result['headline_vs_content_score'], 40)
        self.assertLess(result['headline_vs_content_score'], 70)
        self.assertGreater(result['neutral_score'], 0.5)  # Should be dominantly neutral

        self.logger.info(f"Neutral headline test result: {result}")

    def test_error_handling(self):
        """Test error handling with invalid inputs."""
        result = self.analyzer.analyze("", "")  # Empty strings
        self.assertEqual(result['headline_vs_content_score'], 0)
        self.assertEqual(result['entailment_score'], 0)
        self.assertEqual(result['contradiction_score'], 0)

    def test_large_content(self):
        """Test when content is too large and requires splitting."""
        headline = "Major Scientific Breakthrough in AI Technology"
        content = " ".join(["AI is evolving rapidly, changing industries worldwide."] * 300)  # Large content
        
        self.logger.info(f"Testing large content splitting with headline:\n{headline}")
        result = self.analyzer.analyze(headline, content)

        self.assertIsInstance(result, dict)
        self.assertIn('headline_vs_content_score', result)
        self.assertIn('entailment_score', result)
        self.assertIn('contradiction_score', result)

        # Ensure it properly processes large text
        self.assertGreater(result['headline_vs_content_score'], 30)  # Should still provide a meaningful score

        self.logger.info(f"Large content test result: {result}")

if __name__ == '__main__':
    unittest.main()
