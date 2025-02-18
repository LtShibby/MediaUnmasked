import { useState } from 'react'
import { UrlInput } from './components/UrlInput'
import { AnalysisResult } from './components/AnalysisResult'
import { Header } from './components/Header'
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
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <main className="space-y-8">
          <UrlInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          {error && (
            <div className="max-w-3xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {analysis && (
            <div className="mt-8">
              <AnalysisResult analysis={analysis} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App 