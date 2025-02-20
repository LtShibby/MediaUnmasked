import logging
from typing import Dict, Any, List
from transformers import pipeline, AutoTokenizer
import numpy as np
import os

logger = logging.getLogger(__name__)

class HeadlineAnalyzer:
    def __init__(self):
        """Initialize the NLI model for contradiction detection."""
        # Set cache directory to /tmp for Vercel's read-only filesystem
        os.environ['TRANSFORMERS_CACHE'] = '/tmp/transformers_cache'
        os.environ['HF_HOME'] = '/tmp/huggingface'
        
        MODEL_NAME = "prajjwal1/bert-tiny"  # Only 4.4M parameters vs 110M for DeBERTa
        
        # Create cache directories
        os.makedirs('/tmp/transformers_cache', exist_ok=True)
        os.makedirs('/tmp/huggingface', exist_ok=True)
        
        self.nli_pipeline = pipeline(
            "text-classification",
            model=MODEL_NAME,
            model_kwargs={"torch_dtype": "float32"}  # Use float32 to reduce size
        )
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        self.max_length = 512
        
    def _split_content(self, headline: str, content: str) -> List[str]:
        """Split content into sections that fit within token limit."""
        content_words = content.split()
        sections = []
        current_section = []
        
        headline_tokens = len(self.tokenizer.encode(headline))
        sep_tokens = len(self.tokenizer.encode("[SEP]")) - 2
        max_content_tokens = self.max_length - headline_tokens - sep_tokens
        
        for word in content_words:
            current_section.append(word)
            current_text = " ".join(current_section)
            if len(self.tokenizer.encode(current_text)) >= max_content_tokens:
                current_section.pop()
                sections.append(" ".join(current_section))
                overlap_start = max(0, len(current_section) - int(len(current_section) * 0.2))
                current_section = current_section[overlap_start:]
                current_section.append(word)
        
        if current_section:
            sections.append(" ".join(current_section))
        
        logger.info(f"""Content Splitting:
            - Original content length: {len(content_words)} words
            - Split into {len(sections)} sections
            - Headline uses {headline_tokens} tokens
            - Available tokens per section: {max_content_tokens}
        """)
        return sections

    def _analyze_section(self, headline: str, section: str) -> Dict[str, float]:
        """Analyze a single section of content."""
        input_text = f"{headline} [SEP] {section}"
        result = self.nli_pipeline(input_text, top_k=None)
        
        scores = {item['label'].lower(): item['score'] for item in result}  # Ensure lowercase keys
        
        logger.info("\nSection Analysis:")
        logger.info("-"*30)
        logger.info(f"Section preview: {section[:100]}...")
        for label, score in scores.items():
            logger.info(f"Label: {label:<12} Score: {score:.3f}")
            
        return scores

    def analyze(self, headline: str, content: str) -> Dict[str, Any]:
        """Analyze how well the headline matches the content using an AI model."""
        try:
            logger.info("\n" + "="*50)
            logger.info("HEADLINE ANALYSIS STARTED")
            logger.info("="*50)
            
            if not headline.strip() or not content.strip():
                logger.warning("Empty headline or content provided")
                return {
                    "headline_vs_content_score": 0,
                    "entailment_score": 0,
                    "contradiction_score": 0,
                    "neutral_score": 0,
                    "contradictory_phrases": []
                }

            content_tokens = len(self.tokenizer.encode(content))
            if content_tokens > self.max_length:
                logger.warning(f"""
                    Content Length Warning:
                    - Total tokens: {content_tokens}
                    - Max allowed: {self.max_length}
                    - Splitting into sections...
                """)
                sections = self._split_content(headline, content)
                section_scores = [self._analyze_section(headline, section) for section in sections]

                # Ensure lowercase label keys are used
                entailment_score = np.mean([s.get('entailment', 0) for s in section_scores])
                contradiction_score = np.max([s.get('contradiction', 0) for s in section_scores])
                neutral_score = np.mean([s.get('neutral', 0) for s in section_scores])

            else:
                scores = self._analyze_section(headline, content)
                entailment_score = scores.get('entailment', 0)
                contradiction_score = scores.get('contradiction', 0)
                neutral_score = scores.get('neutral', 0)
            
            final_score = (
                (entailment_score * 0.6) +
                (neutral_score * 0.3) +
                ((1 - contradiction_score) * 0.1)
            ) * 100

            logger.info(f"\nDEBUG - Aggregated Scores: Entailment: {entailment_score:.3f}, Contradiction: {contradiction_score:.3f}, Neutral: {neutral_score:.3f}")
            
            logger.info("\nFinal Analysis Results:")
            logger.info("-"*30)
            logger.info(f"Headline: {headline}")
            logger.info(f"Content Length: {content_tokens} tokens")
            logger.info("\nFinal Scores:")
            logger.info(f"{'Entailment:':<15} {entailment_score:.3f}")
            logger.info(f"{'Neutral:':<15} {neutral_score:.3f}")
            logger.info(f"{'Contradiction:':<15} {contradiction_score:.3f}")
            logger.info(f"\nFinal Score: {final_score:.1f}%")
            logger.info("="*50 + "\n")
            
            return {
                "headline_vs_content_score": round(final_score, 1),
                "entailment_score": round(entailment_score, 2),
                "contradiction_score": round(contradiction_score, 2),
                "neutral_score": round(neutral_score, 2),  # ✅ Fixed key mismatch here
                "contradictory_phrases": []
            }
        
        except Exception as e:
            logger.error("\nHEADLINE ANALYSIS ERROR")
            logger.error("-"*30)
            logger.error(f"Error Type: {type(e).__name__}")
            logger.error(f"Error Message: {str(e)}")
            logger.error("Stack Trace:", exc_info=True)
            logger.error("="*50 + "\n")
            return {
                "headline_vs_content_score": 0,
                "entailment_score": 0,
                "contradiction_score": 0,
                "neutral_score": 0,  # ✅ Fixed key mismatch here
                "contradictory_phrases": []
            }
