import { FC, useMemo } from 'react';
import { AnalysisResponse } from '../services/api';

interface Props {
  analysis: AnalysisResponse;
}

export const AnalysisResult: FC<Props> = ({ analysis }) => {
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
      biasScore: (analysis?.media_score?.details?.bias_analysis?.confidence_score ?? 0) * 100,
    };
  }, [analysis]);

  console.log('Calculated scores:', scores);

  if (!analysis) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Overall Score Card */}
      <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {scores.hasMediaScore ? (
              <>Media Unmasked Score: {analysis.media_score.media_unmasked_score.toFixed(1)}%</>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScoreCard
            title="Headline Analysis"
            score={100 - scores.headlineScore}
            details={analysis.media_score?.details?.headline_analysis?.contradictory_phrases}
            color="blue"
          />

          <ScoreCard
            title="Evidence-Based Reporting"
            score={scores.evidenceScore}
            color="green"
          />

          <ScoreCard
            title="Manipulation Detection"
            score={100 - scores.manipulationScore}
            details={analysis.media_score?.details?.sentiment_analysis?.flagged_phrases}
            color="amber"
          />

          <ScoreCard
            title="Bias Analysis"
            score={scores.biasScore}
            details={[`Detected Bias: ${analysis.media_score?.details?.bias_analysis?.bias}`]}
            color="purple"
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{analysis.headline}</h2>
        <p className="text-gray-600 leading-relaxed">{analysis.content}</p>
      </div>
    </div>
  );
};

// Separate ScoreCard component for better organization
interface ScoreCardProps {
  title: string;
  score: number;
  details?: string[];
  color: 'blue' | 'green' | 'amber' | 'purple';
}

const ScoreCard: FC<ScoreCardProps> = ({ title, score, details, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  const scoreColor = score >= 80 ? 'text-green-600' : 
                    score >= 50 ? 'text-amber-600' : 
                    'text-red-600';

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${scoreColor}`}>
        {score.toFixed(1)}%
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