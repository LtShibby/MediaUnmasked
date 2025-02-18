from typing import List, Dict, Any
import numpy as np
from transformers import pipeline
from textblob import TextBlob
import spacy

class MediaScorer:
    def __init__(self):
        # Initialize NLP models
        self.nlp = spacy.load("en_core_web_sm")
        self.sentiment_analyzer = pipeline("sentiment-analysis")
        self.zero_shot = pipeline("zero-shot-classification")

    def analyze_headline_content(self, headline: str, content: str) -> Dict[str, Any]:
        """Compare headline and content for discrepancies."""
        # Use zero-shot classification to check if content supports headline
        candidate_labels = ["supports headline", "contradicts headline"]
        result = self.zero_shot(content[:512], candidate_labels)
        
        contradiction_score = result['scores'][1]  # Score for "contradicts headline"
        
        return {
            "headline_vs_content_score": int(contradiction_score * 100),
            "contradictory_phrases": self._find_contradictions(headline, content)
        }

    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment and detect manipulation."""
        blob = TextBlob(text)
        sentiment_score = blob.sentiment.polarity
        
        # Detect manipulative phrases
        manipulative_phrases = self._detect_manipulative_phrases(text)
        manipulation_score = len(manipulative_phrases) * 10  # Simple scoring
        
        # Determine sentiment category
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
        """Detect political or ideological bias."""
        # Use zero-shot classification for political leaning
        candidate_labels = ["left-leaning", "neutral", "right-leaning"]
        result = self.zero_shot(text[:512], candidate_labels)
        
        max_score = max(result['scores'])
        bias_label = result['labels'][result['scores'].index(max_score)]
        
        bias_mapping = {
            "left-leaning": "Leaning Left",
            "neutral": "Neutral",
            "right-leaning": "Leaning Right"
        }
        
        return {
            "bias": bias_mapping[bias_label],
            "confidence_score": float(max_score)
        }

    def analyze_evidence(self, text: str) -> Dict[str, Any]:
        """Check for evidence-based reporting."""
        doc = self.nlp(text)
        
        # Count citations and references
        citation_markers = ["according to", "cited", "study", "research", "report"]
        vague_markers = ["experts say", "some say", "many believe", "sources say"]
        
        citation_count = sum(1 for marker in citation_markers if marker in text.lower())
        vague_count = sum(1 for marker in vague_markers if marker in text.lower())
        
        # Calculate evidence score
        base_score = min(citation_count * 20, 100)  # Each citation adds 20 points up to 100
        penalty = vague_count * 10  # Each vague reference reduces score by 10
        
        evidence_score = max(0, base_score - penalty)
        
        return {
            "evidence_based_score": evidence_score
        }

    def calculate_media_score(self, headline: str, content: str) -> Dict[str, Any]:
        """Calculate final media credibility score."""
        # Get individual scores
        headline_analysis = self.analyze_headline_content(headline, content)
        sentiment_analysis = self.analyze_sentiment(content)
        bias_analysis = self.analyze_bias(content)
        evidence_analysis = self.analyze_evidence(content)
        
        # Calculate final score using the weighted formula
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
        
        # Determine rating
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
        manipulative_patterns = [
            "experts fear",
            "some say",
            "it's clear that",
            "everyone knows",
            "obviously",
            "clearly",
            "without doubt",
            "sources say"
        ]
        
        found_phrases = []
        text_lower = text.lower()
        
        for pattern in manipulative_patterns:
            if pattern in text_lower:
                # Find the actual phrase with context
                start = text_lower.find(pattern)
                context = text[max(0, start-20):min(len(text), start+len(pattern)+20)]
                found_phrases.append(context.strip())
        
        return found_phrases

    def _find_contradictions(self, headline: str, content: str) -> List[str]:
        """Find potential contradictions between headline and content."""
        # Simple contradiction detection based on negation
        headline_doc = self.nlp(headline)
        content_doc = self.nlp(content[:1000])  # Limit to first 1000 chars for performance
        
        contradictions = []
        
        # Check if main verbs in headline are negated in content
        headline_verbs = [token.lemma_ for token in headline_doc if token.pos_ == "VERB"]
        
        for sent in content_doc.sents:
            for verb in headline_verbs:
                if verb in sent.text and any(token.dep_ == "neg" for token in sent):
                    contradictions.append(sent.text.strip())
        
        return contradictions 