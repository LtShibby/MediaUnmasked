import { FC } from 'react';

interface Props {
  onNavigate: (page: 'home' | 'analyze') => void;
  currentPage: 'home' | 'analyze';
}

export const Header: FC<Props> = ({ onNavigate, currentPage }) => {
  return (
    <header className="py-6 mb-8">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            MediaUnmask
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Unmask media bias with AI-powered analysis
          </p>
        </div>
        <nav className="space-x-4">
          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === 'home'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Our Mission
          </button>
          <button
            onClick={() => onNavigate('analyze')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === 'analyze'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Analyze Articles
          </button>
        </nav>
      </div>
    </header>
  );
}; 