import { useState } from 'react'
import { UrlInput } from './components/UrlInput'
import { AnalysisResult } from './components/AnalysisResult'
import { Header } from './components/Header'
import { LoadingSpinner } from './components/LoadingSpinner'
import { analyzeArticle, AnalysisResponse } from './services/api'

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await analyzeArticle(url);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <UrlInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-300">
              {error}
            </div>
          )}
          
          {isLoading && (
            <div className="mt-8 flex justify-center">
              <LoadingSpinner />
            </div>
          )}
          
          {analysis && !isLoading && (
            <div className="mt-8">
              <AnalysisResult analysis={analysis} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App 