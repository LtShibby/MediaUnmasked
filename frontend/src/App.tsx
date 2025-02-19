import { useState } from 'react'
import { UrlInput } from './components/UrlInput'
import { AnalysisResult } from './components/AnalysisResult'
import { Header } from './components/Header'
import { AboutPage } from './components/AboutPage'
import { Footer } from './components/Footer'
import { analyzeArticle, AnalysisResponse } from './services/api'

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'analyze'>('home');

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting analysis for URL:', url);
      const result = await analyzeArticle(url);
      console.log('Analysis result:', result);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />
        <main className="space-y-8">
          {currentPage === 'home' ? (
            <AboutPage onStartAnalyzing={() => setCurrentPage('analyze')} />
          ) : (
            <div className="space-y-8">
              <UrlInput onAnalyze={handleAnalyze} isLoading={isLoading} />
              
              {error && (
                <div className="max-w-3xl mx-auto">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium">Error</p>
                    <p className="text-red-600 mt-1 text-sm whitespace-pre-wrap">{error}</p>
                  </div>
                </div>
              )}
              
              {analysis && (
                <div className="mt-8">
                  <AnalysisResult analysis={analysis} />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App 