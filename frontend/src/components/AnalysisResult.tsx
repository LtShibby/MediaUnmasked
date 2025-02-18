import { FC } from 'react';
import { AnalysisResponse } from '../services/api';

interface Props {
  analysis: AnalysisResponse;
}

export const AnalysisResult: FC<Props> = ({ analysis }) => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{analysis.headline}</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Sentiment Analysis</h3>
          <p className="text-2xl font-bold mt-2 text-blue-700">{analysis.sentiment}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Bias Analysis</h3>
          <p className="text-2xl font-bold mt-2 text-purple-700">{analysis.bias}</p>
          <p className="text-sm text-purple-600 mt-1">
            Confidence: {analysis.confidence_score.toFixed(1)}%
          </p>
        </div>
      </div>
      
      {analysis.flagged_phrases.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Potentially Biased Phrases
          </h3>
          <div className="space-y-2">
            {analysis.flagged_phrases.map((phrase, index) => (
              <div
                key={index}
                className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800"
              >
                {phrase}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Article Content</h3>
        <div className="bg-gray-50 p-4 rounded-lg prose max-w-none">
          {analysis.content}
        </div>
      </div>
    </div>
  );
}; 