from typing import List, Dict, Any
from textblob import TextBlob
import re
import numpy as np

class MediaScorer:
    def __init__(self):
        # Remove heavy ML models initialization
        self.manipulative_patterns = [
            "experts fear",
            "some say",
            "it's clear that",
            "everyone knows",
            "obviously",
            "clearly",
            "without doubt",
            "sources say"
        ]
        
        self.citation_markers = [
            "according to",
            "cited",
            "study",
            "research",
            "report"
        ]
        
        self.vague_markers = [
            "experts say",
            "some say",
            "many believe",
            "sources say"
        ]

    def analyze_headline_content(self, headline: str, content: str) -> Dict[str, Any]:
        """Compare headline and content for discrepancies using simpler methods."""
        # Use basic text comparison instead of zero-shot classification
        headline_words = set(headline.lower().split())
        content_first_para = ' '.join(content.split('.')[:3]).lower()
        
        # Check if key headline words appear in first few sentences
        word_matches = sum(1 for word in headline_words if word in content_first_para)
        match_score = (word_matches / len(headline_words)) * 100
        contradiction_score = 100 - match_score
        
        return {
            "headline_vs_content_score": int(contradiction_score),
            "contradictory_phrases": self._find_contradictions(headline, content)
        }

    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment using TextBlob."""
        blob = TextBlob(text)
        sentiment_score = blob.sentiment.polarity
        
        manipulative_phrases = self._detect_manipulative_phrases(text)
        manipulation_score = len(manipulative_phrases) * 10
        
        if sentiment_score > 0.2:
            sentiment = "Positive"
        elif sentiment_score < -0.2:
            sentiment = "Negative"
        else:
            sentiment = "Neutral"
        
        if manipulation_score > 50:
            sentiment = "Manipulative"
        
        return {
            "sentiment": sentiment,
            "manipulation_score": min(manipulation_score, 100),
            "flagged_phrases": manipulative_phrases
        }

    def analyze_bias(self, text: str) -> Dict[str, Any]:
        """Detect bias using keyword analysis instead of ML."""
        text_lower = text.lower()
        
        # Simple keyword-based bias detection
        left_keywords = ['progressive', 'liberal', 'democrat', 'socialism']
        right_keywords = ['conservative', 'republican', 'trump', 'freedom']
        
        left_count = sum(1 for word in left_keywords if word in text_lower)
        right_count = sum(1 for word in right_keywords if word in text_lower)
        
        if left_count > right_count:
            bias = "Leaning Left"
            confidence = min((left_count - right_count) * 0.2, 1.0)
        elif right_count > left_count:
            bias = "Leaning Right"
            confidence = min((right_count - left_count) * 0.2, 1.0)
        else:
            bias = "Neutral"
            confidence = 0.5
        
        return {
            "bias": bias,
            "confidence_score": confidence
        }

    def analyze_evidence(self, text: str) -> Dict[str, Any]:
        """Check for evidence-based reporting."""
        text_lower = text.lower()
        
        citation_count = sum(1 for marker in self.citation_markers if marker in text_lower)
        vague_count = sum(1 for marker in self.vague_markers if marker in text_lower)
        
        base_score = min(citation_count * 20, 100)
        penalty = vague_count * 10
        
        evidence_score = max(0, base_score - penalty)
        
        return {
            "evidence_based_score": evidence_score
        }

    def calculate_media_score(self, headline: str, content: str) -> Dict[str, Any]:
        """Calculate final media credibility score."""
        headline_analysis = self.analyze_headline_content(headline, content)
        sentiment_analysis = self.analyze_sentiment(content)
        bias_analysis = self.analyze_bias(content)
        evidence_analysis = self.analyze_evidence(content)
        
        headline_score = 1 - (headline_analysis["headline_vs_content_score"] / 100)
        manipulation_score = 1 - (sentiment_analysis["manipulation_score"] / 100)
        bias_score = 1 - (bias_analysis["confidence_score"] if bias_analysis["bias"] != "Neutral" else 0)
        evidence_score = evidence_analysis["evidence_based_score"] / 100
        
        final_score = (
            (headline_score * 0.3) +
            (manipulation_score * 0.2) +
            (bias_score * 0.2) +
            (evidence_score * 0.3)
        ) * 100
        
        if final_score >= 80:
            rating = "Highly Trustworthy"
        elif final_score >= 50:
            rating = "Some Bias Present"
        else:
            rating = "Potentially Misleading"
        
        return {
            "media_unmasked_score": round(final_score, 1),
            "rating": rating,
            "details": {
                "headline_analysis": headline_analysis,
                "sentiment_analysis": sentiment_analysis,
                "bias_analysis": bias_analysis,
                "evidence_analysis": evidence_analysis
            }
        }

    def _detect_manipulative_phrases(self, text: str) -> List[str]:
        """Detect potentially manipulative phrases."""
        found_phrases = []
        text_lower = text.lower()
        
        for pattern in self.manipulative_patterns:
            if pattern in text_lower:
                start = text_lower.find(pattern)
                context = text[max(0, start-20):min(len(text), start+len(pattern)+20)]
                found_phrases.append(context.strip())
        
        return found_phrases

    def _find_contradictions(self, headline: str, content: str) -> List[str]:
        """Find potential contradictions using simple text analysis."""
        contradictions = []
        headline_lower = headline.lower()
        content_sentences = content.split('.')
        
        for sentence in content_sentences:
            if "not" in sentence.lower() and any(word in sentence.lower() for word in headline_lower.split()):
                contradictions.append(sentence.strip())
        
        return contradictions 