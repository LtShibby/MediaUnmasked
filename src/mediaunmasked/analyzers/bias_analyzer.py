from typing import List, Dict, Optional, Tuple
import logging
from dataclasses import dataclass
import spacy
import re
from transformers import pipeline

from ..utils.logging_config import setup_logging

@dataclass
class BiasAnalysisResult:
    sentiment: str
    bias: str
    flagged_phrases: List[str]
    confidence_score: float

class BiasAnalyzer:
    def __init__(self):
        # Initialize sentiment analyzer
        self.sentiment_analyzer = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")
        
        # Load spaCy model for NLP tasks
        self.nlp = spacy.load("en_core_web_sm")
        
        # Initialize logger
        setup_logging()
        self.logger = logging.getLogger(__name__)
        
        # Define bias-indicating phrases
        self.bias_phrases = {
            'left': [
                'progressive', 'liberal', 'socialist', 'workers rights',
                'climate crisis', 'social justice', 'systemic racism'
            ],
            'right': [
                'conservative', 'traditional values', 'free market',
                'small government', 'law and order', 'illegal aliens'
            ]
        }
        
        # Define manipulative language patterns
        self.manipulative_patterns = [
            r"experts fear",
            r"some say",
            r"many believe",
            r"it's clear that",
            r"obviously",
            r"everyone knows",
            r"sources say",
            r"people are saying",
            r"\b(all|none|every|always|never)\b",
        ]

    def _analyze_sentiment(self, text: str) -> Tuple[str, float]:
        """Analyze the overall sentiment of the text."""
        try:
            # Get sentiment predictions
            results = self.sentiment_analyzer(text[:512])  # Limit text length for performance
            sentiment_score = float(results[0]['score'])
            
            # Map score to sentiment category
            if sentiment_score <= 0.2:
                return "Negative", sentiment_score
            elif sentiment_score <= 0.4:
                return "Slightly Negative", sentiment_score
            elif sentiment_score <= 0.6:
                return "Neutral", sentiment_score
            elif sentiment_score <= 0.8:
                return "Slightly Positive", sentiment_score
            else:
                return "Positive", sentiment_score
                
        except Exception as e:
            self.logger.error(f"Error in sentiment analysis: {str(e)}")
            return "Neutral", 0.5

    def _detect_bias(self, text: str) -> Tuple[str, float]:
        """Detect political bias in the text."""
        text_lower = text.lower()
        
        # Count occurrences of bias-indicating phrases
        left_count = sum(text_lower.count(phrase) for phrase in self.bias_phrases['left'])
        right_count = sum(text_lower.count(phrase) for phrase in self.bias_phrases['right'])
        
        # Calculate bias score (-1 to 1, where -1 is left and 1 is right)
        total_count = left_count + right_count
        if total_count == 0:
            return "Neutral", 0.5
            
        bias_score = (right_count - left_count) / total_count
        
        # Determine bias category and confidence
        if bias_score < -0.3:
            return "Leaning Left", abs(bias_score)
        elif bias_score > 0.3:
            return "Leaning Right", abs(bias_score)
        else:
            return "Neutral", 1 - abs(bias_score)

    def _find_manipulative_phrases(self, text: str) -> List[str]:
        """Identify potentially manipulative or misleading phrases."""
        flagged_phrases = []
        
        # Check for manipulative patterns
        for pattern in self.manipulative_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                # Get some context around the match
                start = max(0, match.start() - 20)
                end = min(len(text), match.end() + 20)
                context = text[start:end].strip()
                flagged_phrases.append(context)
                
        # Check for emotional amplifiers
        doc = self.nlp(text)
        for token in doc:
            if token.pos_ == "ADV" and token.text.lower() in [
                "extremely", "absolutely", "definitely", "clearly",
                "obviously", "undoubtedly", "certainly"
            ]:
                # Get the sentence containing this adverb
                sentence = next(sent for sent in doc.sents if token in sent)
                flagged_phrases.append(sentence.text.strip())
                
        return list(set(flagged_phrases))  # Remove duplicates

    def analyze(self, text: str) -> BiasAnalysisResult:
        """
        Analyze text for sentiment, bias, and manipulative language.
        Returns a BiasAnalysisResult with the analysis results.
        """
        try:
            # Analyze sentiment
            sentiment, sentiment_confidence = self._analyze_sentiment(text)
            
            # Detect bias
            bias, bias_confidence = self._detect_bias(text)
            
            # Find manipulative phrases
            flagged_phrases = self._find_manipulative_phrases(text)
            
            # Calculate overall confidence score
            confidence_score = (sentiment_confidence + bias_confidence) * 50  # Scale to 0-100
            
            return BiasAnalysisResult(
                sentiment=sentiment,
                bias=bias,
                flagged_phrases=flagged_phrases,
                confidence_score=confidence_score
            )
            
        except Exception as e:
            self.logger.error(f"Error in bias analysis: {str(e)}")
            return BiasAnalysisResult(
                sentiment="Error",
                bias="Error",
                flagged_phrases=[],
                confidence_score=0
            )
