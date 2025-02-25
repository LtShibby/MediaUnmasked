import { FC, useMemo, useState, useEffect, useRef } from 'react';
import { AnalysisResponse } from '../services/api';
import { ArticleContent } from './ArticleContent';

interface Props {
  analysis: AnalysisResponse;
}

export const AnalysisResult: FC<Props> = ({ analysis }) => {
  const overallScoreButtonRef = useRef<HTMLButtonElement>(null);
  // Add detailed logging
  console.log('=== Analysis Response Structure ===');
  console.log('Raw analysis prop:', JSON.stringify(analysis, null, 2));  // Pretty print
  console.log('Media score type:', typeof analysis.media_score);
  console.log('All keys:', Object.keys(analysis));
  
  // Memoize score calculations to prevent unnecessary recalculations
  const scores = useMemo(() => {
    console.log('Calculating scores from:', JSON.stringify(analysis.media_score, null, 2));
    
    const hasScore = Boolean(
      analysis?.media_score?.media_unmasked_score && 
      analysis?.media_score?.rating
    );
    console.log('Has media score:', hasScore, {
      score: analysis?.media_score?.media_unmasked_score,
      rating: analysis?.media_score?.rating
    });
    
    return {
      hasMediaScore: hasScore,
      headlineScore: analysis?.media_score?.details?.headline_analysis?.headline_vs_content_score ?? 0,
      evidenceScore: analysis?.media_score?.details?.evidence_analysis?.evidence_based_score ?? 0,
      manipulationScore: analysis?.media_score?.details?.sentiment_analysis?.manipulation_score ?? 0,
      biasScore: analysis?.media_score?.details?.bias_analysis?.bias_percentage ?? 0,
    };
  }, [analysis]);

  console.log('Calculated scores:', scores);

  // Lift modal state up to parent
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState<DOMRect | null>(null);

  const handleModalOpen = (cardTitle: string, position: DOMRect) => {
    setActiveModal(cardTitle);
    setModalPosition(position);
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setModalPosition(null);
  };

  if (!analysis) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 px-4">
      {/* Overall Score Card */}
      <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
        <div className="text-center mb-6 relative">
          <button
            ref={overallScoreButtonRef}
            onClick={() => handleModalOpen(
              "Media Unmasked Score", 
              overallScoreButtonRef.current?.getBoundingClientRect() || new DOMRect()
            )}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            title="View score calculation"
          >
            <InfoIcon />
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {scores.hasMediaScore ? (
              <>Media Unmasked Score: {(
                (scores.headlineScore * 0.25) +
                (scores.evidenceScore * 0.25) +
                (scores.manipulationScore * 0.25) +
                ((100 - scores.biasScore) * 0.25)
              ).toFixed(1)}%</>
            ) : (
              'Analyzing Article...'
            )}
          </h2>
          {scores.hasMediaScore && (
            <p className="text-lg font-medium text-gray-600 mt-2">
              {analysis.media_score.rating}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <ScoreCard
            title="Headline Analysis"
            isModalOpen={activeModal === "Headline Analysis"}
            onModalOpen={handleModalOpen}
            onModalClose={handleModalClose}
            score={scores.headlineScore}
            details={[
              `Headline Quality: ${
                scores.headlineScore >= 80 ? "Excellent Match" :
                scores.headlineScore >= 60 ? "Good Match" :
                scores.headlineScore >= 40 ? "Fair Match" :
                scores.headlineScore >= 20 ? "Poor Match" :
                "Misleading"
              }`,
              ...(analysis.media_score?.details?.headline_analysis?.contradictory_phrases || [])
            ]}
            color="blue"
            explanation={{
              short: "Measures how well the headline matches the article content",
              detailed: (
                <div className="space-y-4">
                  <p>The Headline Analysis score is calculated by examining:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Content Matching:</strong> How well the headline reflects the actual content</li>
                    <li><strong>Clickbait Detection:</strong> Identifies sensationalized or misleading headlines</li>
                    <li><strong>Contradiction Analysis:</strong> Flags statements that contradict the headline</li>
                  </ul>
                  <p className="text-sm text-gray-600">
                    A score of 100% indicates perfect alignment between headline and content,
                    while lower scores suggest potential misleading or clickbait headlines.
                  </p>
                </div>
              )
            }}
          />

          <ScoreCard
            title="Evidence-Based Reporting"
            isModalOpen={activeModal === "Evidence-Based Reporting"}
            onModalOpen={handleModalOpen}
            onModalClose={handleModalClose}
            score={scores.evidenceScore}
            details={[
              `Evidence Level: ${
                scores.evidenceScore >= 80 ? "Well Supported" :
                scores.evidenceScore >= 60 ? "Adequately Supported" :
                scores.evidenceScore >= 40 ? "Partially Supported" :
                scores.evidenceScore >= 20 ? "Poorly Supported" :
                "Unsupported"
              }`
            ]}
            color="green"
            explanation={{
              short: "Evaluates the presence of citations, sources, and factual evidence. Higher scores indicate well-supported claims with verifiable sources.",
              detailed: (
                <div className="space-y-4">
                  <p>The Evidence-Based Reporting score evaluates:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Citations:</strong> Use of credible sources and references</li>
                    <li><strong>Data Support:</strong> Inclusion of statistics and factual evidence</li>
                    <li><strong>Expert Quotes:</strong> References to expert opinions and studies</li>
                  </ul>
                  <p className="text-sm text-gray-600">
                    Current Score: {scores.evidenceScore}% - {scores.evidenceScore >= 80 ? 'Well-supported' : 
                    scores.evidenceScore >= 50 ? 'Moderately supported' : 'Poorly supported'}
                  </p>
                </div>
              )
            }}
          />

          <ScoreCard
            title="Manipulation Detection"
            isModalOpen={activeModal === "Manipulation Detection"}
            onModalOpen={handleModalOpen}
            onModalClose={handleModalClose}
            score={scores.manipulationScore}
            details={[
              `Manipulation Level: ${
                scores.manipulationScore <= 20 ? "Extreme Manipulation" :
                scores.manipulationScore <= 40 ? "High Manipulation" :
                scores.manipulationScore <= 60 ? "Moderate Manipulation" :
                scores.manipulationScore <= 80 ? "Low Manipulation" :
                "Minimal Manipulation"
              }`,
              ...(analysis.media_score?.details?.sentiment_analysis?.flagged_phrases || [])
            ]}
            color="amber"
            explanation={{
              short: "Measures absence of manipulative language (higher score = less manipulation)",
              detailed: (
                <div className="space-y-4">
                  <p>The Manipulation Detection score analyzes:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Emotional Language:</strong> Use of emotionally charged words</li>
                    <li><strong>Loaded Phrases:</strong> Expressions designed to provoke reactions</li>
                    <li><strong>Manipulative Patterns:</strong> Common persuasion techniques</li>
                  </ul>
                  <p className="text-sm text-gray-600">
                    A score of 100% indicates no manipulative language detected,
                    while 0% indicates highly manipulative content.
                  </p>
                  {analysis.media_score?.details?.sentiment_analysis?.flagged_phrases?.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium">Flagged Phrases:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        {analysis.media_score.details.sentiment_analysis.flagged_phrases.map((phrase, index) => (
                          <li key={index} className="text-sm text-gray-600">{phrase}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            }}
          />

          <ScoreCard
            title="Bias Analysis"
            isModalOpen={activeModal === "Bias Analysis"}
            onModalOpen={handleModalOpen}
            onModalClose={handleModalClose}
            score={analysis.media_score?.details?.bias_analysis?.bias_percentage || 0}
            details={[
              `Detected Bias: ${analysis.media_score?.details?.bias_analysis?.bias}`,
              `Bias Level: ${
                scores.biasScore <= 20 ? "Minimal Bias" :
                scores.biasScore <= 40 ? "Low Bias" :
                scores.biasScore <= 60 ? "Moderate Bias" :
                scores.biasScore <= 80 ? "High Bias" :
                "Extreme Bias"
              }`
            ]}
            color="purple"
            explanation={{
              short: "Measures political bias using keyword analysis",
              detailed: (
                <div className="space-y-4">
                  <p>The Bias Analysis score measures:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Political Leaning:</strong> Detection of left/right-leaning language</li>
                    <li><strong>Bias Intensity:</strong> Strength of detected bias (0-100%)</li>
                    <li><strong>Keyword Analysis:</strong> Presence of politically charged terms</li>
                  </ul>
                  <p className="text-sm text-gray-600">
                    Current Analysis: {analysis.media_score?.details?.bias_analysis?.bias} with 
                    {analysis.media_score?.details?.bias_analysis?.bias_percentage}% intensity
                  </p>
                </div>
              )
            }}
          />
        </div>
      </div>

      {/* Article Content */}
      <ArticleContent 
        headline={analysis.headline}
        content={analysis.content}
      />

      {/* Single Modal instance */}
      {activeModal && modalPosition && (
        <Modal
          isOpen={true}
          onClose={handleModalClose}
          title={`${activeModal} - Scoring Breakdown`}
          content={
            // Get the explanation.detailed from the matching ScoreCard
            activeModal === "Media Unmasked Score" ? (
              <div className="space-y-4">
                <p>The Media Unmasked Score is a weighted combination of four key metrics:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Headline Analysis (25%):</strong> How well the headline matches the content
                    <div className="text-sm text-gray-600 mt-1">
                      Current Score: {scores.headlineScore.toFixed(1)}%
                    </div>
                  </li>
                  <li>
                    <strong>Evidence-Based Reporting (25%):</strong> Presence of verifiable sources and data
                    <div className="text-sm text-gray-600 mt-1">
                      Current Score: {scores.evidenceScore.toFixed(1)}%
                    </div>
                  </li>
                  <li>
                    <strong>Manipulation Detection (25%):</strong> Absence of manipulative language
                    <div className="text-sm text-gray-600 mt-1">
                      Current Score: {scores.manipulationScore.toFixed(1)}% 
                      <span className="italic">(inverted: 0% = good, 100% = bad)</span>
                    </div>
                  </li>
                  <li>
                    <strong>Bias Analysis (25%):</strong> Political neutrality
                    <div className="text-sm text-gray-600 mt-1">
                      Current Score: {(100 - scores.biasScore).toFixed(1)}% 
                      <span className="italic">(inverted: 0% = good, 100% = bad)</span>
                    </div>
                  </li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Final Score Calculation:</strong><br />
                  Headline Score: ({scores.headlineScore.toFixed(1)}% × 0.25) = {(scores.headlineScore * 0.25).toFixed(1)}%<br />
                  Evidence Score: ({scores.evidenceScore.toFixed(1)}% × 0.25) = {(scores.evidenceScore * 0.25).toFixed(1)}%<br />
                  Manipulation Score: ({scores.manipulationScore.toFixed(1)}% × 0.25) = {(scores.manipulationScore * 0.25).toFixed(1)}%<br />
                  Bias Score: ({(100 - scores.biasScore).toFixed(1)}% × 0.25) = {((100 - scores.biasScore) * 0.25).toFixed(1)}%<br />
                  <br />
                  Total: ({(scores.headlineScore * 0.25).toFixed(1)} + 
                         {(scores.evidenceScore * 0.25).toFixed(1)} + 
                         {(scores.manipulationScore * 0.25).toFixed(1)} + 
                         {((100 - scores.biasScore) * 0.25).toFixed(1)})%
                  = {(
                      (scores.headlineScore * 0.25) +
                      (scores.evidenceScore * 0.25) +
                      (scores.manipulationScore * 0.25) +
                      ((100 - scores.biasScore) * 0.25)
                    ).toFixed(1)}%
                </p>
              </div>
            ) : activeModal === "Headline Analysis" ? (
              <div className="space-y-4">
                <p>The Headline Analysis score is calculated by examining:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Content Matching:</strong> How well the headline reflects the actual content</li>
                  <li><strong>Clickbait Detection:</strong> Identifies sensationalized or misleading headlines</li>
                  <li><strong>Contradiction Analysis:</strong> Flags statements that contradict the headline</li>
                </ul>
                <p className="text-sm text-gray-600">
                  A score of 100% indicates perfect alignment between headline and content,
                  while lower scores suggest potential misleading or clickbait headlines.
                </p>
              </div>
            ) : activeModal === "Evidence-Based Reporting" ? (
              <div className="space-y-4">
                <p>The Evidence-Based Reporting score evaluates:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Citations:</strong> Use of credible sources and references</li>
                  <li><strong>Data Support:</strong> Inclusion of statistics and factual evidence</li>
                  <li><strong>Expert Quotes:</strong> References to expert opinions and studies</li>
                </ul>
                <p className="text-sm text-gray-600">
                  Current Score: {scores.evidenceScore}% - {scores.evidenceScore >= 80 ? 'Well-supported' : 
                  scores.evidenceScore >= 50 ? 'Moderately supported' : 'Poorly supported'}
                </p>
              </div>
            ) : activeModal === "Manipulation Detection" ? (
              <div className="space-y-4">
                <p>The Manipulation Detection score analyzes:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Emotional Language:</strong> Use of emotionally charged words</li>
                  <li><strong>Loaded Phrases:</strong> Expressions designed to provoke reactions</li>
                  <li><strong>Manipulative Patterns:</strong> Common persuasion techniques</li>
                </ul>
                {analysis.media_score?.details?.sentiment_analysis?.flagged_phrases?.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium">Flagged Phrases:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {analysis.media_score.details.sentiment_analysis.flagged_phrases.map((phrase, index) => (
                        <li key={index} className="text-sm text-gray-600">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p>The Bias Analysis score measures:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Political Leaning:</strong> Detection of left/right-leaning language</li>
                  <li><strong>Bias Intensity:</strong> Strength of detected bias (0-100%)</li>
                  <li><strong>Keyword Analysis:</strong> Presence of politically charged terms</li>
                </ul>
                <p className="text-sm text-gray-600">
                  Current Analysis: {analysis.media_score?.details?.bias_analysis?.bias} with 
                  {analysis.media_score?.details?.bias_analysis?.bias_percentage}% intensity
                </p>
              </div>
            )
          }
          triggerRect={modalPosition}
        />
      )}
    </div>
  );
};

// Separate ScoreCard component for better organization
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  triggerRect: DOMRect | null;  // Add position of the trigger element
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  // Just handle scroll/resize for closing
  useEffect(() => {
    const handleScroll = () => {
      // Optional: Close modal on scroll
      // onClose();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', onClose);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  const modalStyle = {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: 'calc(100vh - 40px)',
    overflowY: 'auto' as const,
    zIndex: 999,
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-998"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        style={modalStyle}
        className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-xl border border-gray-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <CloseIcon />
        </button>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="prose prose-sm max-w-none">
          {content}
        </div>
      </div>
    </>
  );
};

interface ScoreCardProps {
  title: string;
  score: number;
  details?: string[];
  color: 'blue' | 'green' | 'amber' | 'purple';
  explanation: {
    short: string;  // For tooltip
    detailed: React.ReactNode;  // For modal
  };
  isModalOpen: boolean;
  onModalOpen: (title: string, position: DOMRect) => void;
  onModalClose: () => void;
}

const ScoreCard: FC<ScoreCardProps> = ({ 
  title, 
  score, 
  details, 
  color,
  explanation,
  onModalOpen
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleInfoClick = () => {
    if (buttonRef.current) {
      onModalOpen(title, buttonRef.current.getBoundingClientRect());
    }
  };

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  // Special handling for bias score color
  const getScoreColor = (score: number, cardType: string) => {
    if (cardType === "Bias Analysis" || cardType === "Manipulation Detection") {
      // For bias and manipulation: 0% = green (neutral/good), 100% = red (extreme/bad)
      if (score === 0) return 'text-green-600';
      if (score === 100) return 'text-red-600';
      
      // Calculate color between green and red based on score
      const red = Math.round((score / 100) * 255);
      const green = Math.round(((100 - score) / 100) * 255);
      return `text-[rgb(${red},${green},0)]`;
    } else {
      return score >= 80 ? 'text-green-600' : 
             score >= 50 ? 'text-amber-600' : 
             'text-red-600';
    }
  };

  return (
    <div 
      className={`rounded-lg border p-4 ${colorClasses[color]} hover:shadow-md transition-shadow relative`}
      title={explanation.short}
    >
      <button
        ref={buttonRef}
        onClick={handleInfoClick}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        title="View scoring breakdown"
      >
        <InfoIcon />
      </button>
      
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${getScoreColor(
        title === "Manipulation Detection" ? 100 - score : score,
        title
      )}`}>
        {(title === "Manipulation Detection" ? 100 - score : score).toFixed(1)}%
      </p>
      
      {details && details.length > 0 && (
        <div className="mt-3 space-y-2">
          {details.map((detail, index) => (
            <p key={index} className="text-sm text-gray-600 bg-white/50 p-2 rounded">
              {detail}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// Add these SVG components at the top of the file
const InfoIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className="w-5 h-5"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" 
    />
  </svg>
);

const CloseIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className="w-6 h-6"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M6 18L18 6M6 6l12 12" 
    />
  </svg>
); 