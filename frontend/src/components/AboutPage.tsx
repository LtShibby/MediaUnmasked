import { FC } from 'react';

interface Props {
  onStartAnalyzing: () => void;
}

export const AboutPage: FC<Props> = ({ onStartAnalyzing }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Our Mission
        </h1>
        <p className="text-xl text-gray-600">
          Unmasking Media Bias & Holding Journalism Accountable
        </p>
      </section>

      {/* Main Content */}
      <section className="prose prose-lg max-w-none">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm p-8 space-y-8">
          {/* About Us */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Us</h2>
            <p className="text-gray-600">
              At <span className="font-semibold">MediaUnmask</span>, we believe the truth should stand on its own—without 
              spin, deception, or hidden agendas. In today's world, where <span className="font-semibold">clickbait, 
              misinformation, and ideological narratives</span> shape public perception, our mission is clear:
            </p>
            <p className="text-lg font-semibold text-indigo-600 my-4">
              Expose bias, highlight manipulation, and encourage transparency in reporting.
            </p>
            <p className="text-gray-600 italic">
              Because the media is always watching you.<br />
              And now, <span className="font-semibold">we're watching them.</span>
            </p>
          </div>

          {/* What We Do */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-gray-600 mb-4">
              Using <span className="font-semibold">advanced AI-powered analysis</span>, MediaUnmask evaluates 
              news articles across four critical dimensions:
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Headline Accuracy</strong> – Does the content contradict the headline?</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Bias Detection</strong> – Is the article slanted toward a particular political or ideological viewpoint?</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Manipulation Analysis</strong> – Does it use emotional triggers, vague attributions, or fear-mongering?</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Evidence-Based Reporting</strong> – Are claims backed by facts, experts, and credible sources?</span>
              </li>
            </ul>
          </div>

          {/* How It Works */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-semibold mb-2">Step 1</h3>
                <p className="text-gray-600">Submit an article link</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl mb-2">⚖️</div>
                <h3 className="font-semibold mb-2">Step 2</h3>
                <p className="text-gray-600">Our AI detects bias, manipulation, and contradictions</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold mb-2">Step 3</h3>
                <p className="text-gray-600">Receive a detailed media score with an in-depth breakdown</p>
              </div>
            </div>
          </div>

          {/* Why It Matters */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why It Matters</h2>
            <p className="text-gray-600">
              Misinformation isn't just a nuisance—it <span className="font-semibold">shapes opinions, 
              drives division, and erodes trust</span> in journalism. Too often, media outlets prioritize 
              engagement over integrity, knowing sensationalism gets clicks. 
              <span className="font-semibold"> We're here to change that.</span>
            </p>
            <div className="my-4 p-4 bg-indigo-50 rounded-lg">
              <p className="text-indigo-600 font-semibold">
                By holding them accountable, we create a media environment where truth prevails.
              </p>
              <p className="text-indigo-600">
                When they know they're being watched, they have no choice but to be more transparent.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Us in Demanding Better Journalism</h2>
            <p className="text-gray-600 mb-6">
              Media literacy isn't optional anymore—it's essential. <span className="font-semibold">
              Every day, we expose bias, uncover contradictions, and push for a new standard in reporting.</span>
            </p>
            <button 
              onClick={onStartAnalyzing}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                       text-white rounded-lg font-medium shadow-lg
                       hover:from-indigo-700 hover:to-purple-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                       transition-all duration-200 ease-in-out"
            >
              Start Analyzing Articles
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}; 