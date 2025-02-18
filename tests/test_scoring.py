import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from mediaunmasked.analyzers.scoring import MediaScorer

def test_scoring():
    # Initialize the scorer
    scorer = MediaScorer()
    
    # Test article
    test_headline = "Study Shows Climate Change Impact Greater Than Expected"
    test_content = """
    A new study published in Nature reveals that the impact of climate change may be more severe than previously thought.
    According to researchers at MIT, global temperatures could rise by up to 2 degrees Celsius by 2050.
    
    Dr. Jane Smith, lead author of the study, states "The data clearly shows an accelerating trend."
    However, some industry experts disagree with the timeline presented in the study.
    
    The research, which analyzed 30 years of climate data, was funded by the National Science Foundation.
    Critics say the models used in the study may be too aggressive in their predictions.
    
    Obviously, this is a matter of great concern for policymakers and the public alike.
    Sources say that several governments are already planning to revise their climate policies.
    """
    
    # Run analysis
    result = scorer.calculate_media_score(test_headline, test_content)
    
    # Print detailed results
    print("\n=== Media Unmasked Analysis Results ===")
    print(f"\nOverall Score: {result['media_unmasked_score']:.1f}%")
    print(f"Rating: {result['rating']}")
    
    print("\n--- Headline Analysis ---")
    print(f"Headline-Content Discrepancy: {result['details']['headline_analysis']['headline_vs_content_score']}%")
    if result['details']['headline_analysis']['contradictory_phrases']:
        print("Contradictions found:")
        for phrase in result['details']['headline_analysis']['contradictory_phrases']:
            print(f"- {phrase}")
    
    print("\n--- Sentiment Analysis ---")
    print(f"Sentiment: {result['details']['sentiment_analysis']['sentiment']}")
    print(f"Manipulation Score: {result['details']['sentiment_analysis']['manipulation_score']}%")
    if result['details']['sentiment_analysis']['flagged_phrases']:
        print("Manipulative phrases found:")
        for phrase in result['details']['sentiment_analysis']['flagged_phrases']:
            print(f"- {phrase}")
    
    print("\n--- Bias Analysis ---")
    print(f"Bias: {result['details']['bias_analysis']['bias']}")
    print(f"Confidence: {result['details']['bias_analysis']['confidence_score'] * 100:.1f}%")
    
    print("\n--- Evidence Analysis ---")
    print(f"Evidence Score: {result['details']['evidence_analysis']['evidence_based_score']}%")

if __name__ == "__main__":
    test_scoring() 