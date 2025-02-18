import { FC, useState } from 'react';

interface Props {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const EXAMPLE_URLS = [
  'https://www.snopes.com/fact-check/trump-super-bowl-cost-taxpayers/',
  'https://www.snopes.com/fact-check/biden-state-of-union-2024/',
  'https://www.politifact.com/factchecks/2024/feb/16/donald-trump/trump-wrong-that-biden-gave-iran-permission-to-make/',
];

export const UrlInput: FC<Props> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(url);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter article URL (e.g., https://www.snopes.com/...)"
          className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      <div className="text-sm text-gray-600">
        <p className="mb-2">Try these example articles:</p>
        <div className="space-y-1">
          {EXAMPLE_URLS.map((exampleUrl) => (
            <button
              key={exampleUrl}
              onClick={() => setUrl(exampleUrl)}
              className="block text-blue-600 hover:underline"
            >
              {exampleUrl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 