import { FC } from 'react';
import { AnalysisResponse } from '../services/api';

interface Props {
  analysis: AnalysisResponse;
}

export const AnalysisResult: FC<Props> = ({ analysis }) => {
  console.log('Analysis prop:', analysis);
  
  // Check if media_score exists and has required properties
  const hasMediaScore = analysis && 
    analysis.media_score && 
    typeof analysis.media_score.media_unmasked_score === 'number' &&
    typeof analysis.media_score.rating === 'string';
  
  console.log('Has media score:', hasMediaScore);
  console.log('Media score object:', analysis?.media_score);
  
  // Log individual properties
  if (analysis?.media_score) {
    console.log('Score:', analysis.media_score.media_unmasked_score);
    console.log('Rating:', analysis.media_score.rating);
    console.log('Details:', analysis.media_score.details);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Overall Score Card */}
      <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {hasMediaScore ? (
              <>Media Unmasked Score: {analysis.media_score.media_unmasked_score}%</>
            ) : (
              'Analyzing Article...'
            )}
          </h2>
          {hasMediaScore && (
            <p className="text-lg font-medium text-gray-600 mt-2">
              {analysis.media_score.rating}
            </p>
          )}
        </div>

        {hasMediaScore ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Headline Analysis */}
            <ScoreCard
              title="Headline Analysis"
              score={100 - analysis.media_score.details.headline_analysis.headline_vs_content_score}
              details={analysis.media_score.details.headline_analysis.contradictory_phrases}
              color="blue"
            />

            {/* Evidence Score */}
            <ScoreCard
              title="Evidence-Based Reporting"
              score={analysis.media_score.details.evidence_analysis.evidence_based_score}
              color="green"
            />

            {/* Manipulation Score */}
            <ScoreCard
              title="Manipulation Detection"
              score={100 - analysis.media_score.details.sentiment_analysis.manipulation_score}
              details={analysis.media_score.details.sentiment_analysis.flagged_phrases}
              color="amber"
            />

            {/* Bias Score */}
            <ScoreCard
              title="Bias Analysis"
              score={analysis.media_score.details.bias_analysis.confidence_score * 100}
              details={[`Detected Bias: ${analysis.media_score.details.bias_analysis.bias}`]}
              color="purple"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse text-gray-500">
              Loading analysis...
            </div>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{analysis.headline}</h2>
        <p className="text-gray-600 leading-relaxed">{analysis.content}</p>
      </div>
    </div>
  );
};

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