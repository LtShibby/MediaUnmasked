import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class HeadlineAnalyzer:
    def analyze(self, headline: str, content: str) -> Dict[str, Any]:
        """Analyze how well the headline matches the content."""
        try:
            # Initialize base score
            base_score = 80  # Start with a good score
            
            # Find contradictory phrases
            contradictory_phrases = self._find_contradictions(headline, content)
            
            # Reduce score for each contradiction found
            contradiction_penalty = 20  # Each contradiction reduces score by 20%
            score_reduction = min(len(contradictory_phrases) * contradiction_penalty, base_score)
            final_score = base_score - score_reduction
            
            return {
                "headline_vs_content_score": final_score,
                "contradictory_phrases": contradictory_phrases
            }
            
        except Exception as e:
            logger.error(f"Error in headline analysis: {str(e)}")
            return {
                "headline_vs_content_score": 0,
                "contradictory_phrases": []
            }

    def _find_contradictions(self, headline: str, content: str) -> List[str]:
        """Find potential contradictions using simple text analysis."""
        contradictions = []
        headline_lower = headline.lower()
        content_sentences = content.split('.')
        
        for sentence in content_sentences:
            if "not" in sentence.lower() and any(word in sentence.lower() for word in headline_lower.split()):
                contradictions.append(sentence.strip())
        
        return contradictions 