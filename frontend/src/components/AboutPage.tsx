import { FC } from 'react';
import { Search, Scale, ShieldCheck, FileText } from "lucide-react";

interface Props {
  onStartAnalyzing: () => void;
}

export const AboutPage: FC<Props> = ({ onStartAnalyzing }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent animate-fade-in pb-4">
          Unmasking Media Bias
        </h1>
        <p className="text-2xl text-gray-700 font-medium animate-fade-in">
          Holding Journalism Accountable in the Digital Age
        </p>
      </section>

      {/* Content Box */}
      <section className="bg-white/60 backdrop-blur-md rounded-lg border border-gray-300 shadow-xl p-10 space-y-10">
        
        {/* About Us */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">About Us</h2>
          <p className="text-lg text-gray-600 mt-4">
            <span className="font-semibold">MediaUnmask</span> believes truth should stand alone—without 
            spin, deception, or bias. In an era of <span className="font-semibold">clickbait, misinformation, and propaganda</span>, 
            we expose hidden narratives and empower readers with unbiased analysis.
          </p>
          <p className="text-indigo-600 font-semibold text-xl mt-4 text-center">
            Because the media watches you. <br /> Now, <span className="underline">we’re watching them.</span>
          </p>
        </div>

        {/* What We Do */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">What We Analyze</h2>
          <p className="text-gray-600 text-lg mb-4">
            Using <b>AI-driven analysis</b>, MediaUnmask evaluates news articles on four core dimensions:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <li className="flex items-center space-x-3 text-gray-700">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span><strong>Headline Accuracy</strong> – Does the article contradict itself?</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-700">
              <Scale className="w-6 h-6 text-blue-500" />
              <span><strong>Bias Detection</strong> – Does it lean toward a specific ideology?</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-700">
              <FileText className="w-6 h-6 text-yellow-500" />
              <span><strong>Manipulation Tactics</strong> – Are fear-mongering or emotional triggers used?</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-700">
              <Search className="w-6 h-6 text-indigo-500" />
              <span><strong>Evidence-Based Reporting</strong> – Are sources credible?</span>
            </li>
          </ul>
        </div>

        {/* How It Works */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl">🔍</div>
              <h3 className="font-semibold text-lg mt-2">Submit an Article</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl">⚖️</div>
              <h3 className="font-semibold text-lg mt-2">AI Analysis</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl">📊</div>
              <h3 className="font-semibold text-lg mt-2">Receive a Media Score</h3>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Demand Better Journalism</h2>
          <p className="text-lg text-gray-600 mt-4">
            Media literacy isn't optional anymore—it's <b>essential.</b> <br />
            Every day, we uncover bias, expose contradictions, and **set a new standard for truth in journalism**.
          </p>
          <button 
            onClick={onStartAnalyzing}
            className="mt-6 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                     text-white text-lg font-medium rounded-lg shadow-md transition-all duration-300
                     hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            🔎 Start Analyzing Articles
          </button>
        </div>

      </section>
    </div>
  );
};
