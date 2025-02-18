import { FC, useState } from 'react';

interface Props {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const EXAMPLE_URLS = [
  'https://www.snopes.com/fact-check/trump-super-bowl-cost-taxpayers/',
  'https://www.politifact.com/factchecks/2025/feb/14/elon-musk/fema-did-not-give-disaster-relief-money-to-new-yor/',
  'https://www.snopes.com/fact-check/muslims-minority-rights-churchill-quote/',
];

export const UrlInput: FC<Props> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(url);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter article URL (e.g., https://www.snopes.com/...)"
          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg shadow-sm 
                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   bg-white/50 backdrop-blur-sm transition-all"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                   text-white rounded-lg font-medium shadow-lg
                   hover:from-indigo-700 hover:to-purple-700
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 ease-in-out"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze'
          )}
        </button>
      </form>

      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 shadow-sm">
        <p className="text-sm font-medium text-gray-700 mb-3">Try these example articles:</p>
        <div className="space-y-2">
          {EXAMPLE_URLS.map((exampleUrl) => (
            <button
              key={exampleUrl}
              onClick={() => setUrl(exampleUrl)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-600 
                       hover:bg-indigo-50 rounded-md transition-colors
                       hover:text-indigo-700"
            >
              {exampleUrl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 