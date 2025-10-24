'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUploader } from '@/components/FileUploader';
import { Button } from '@/components/Button';

export default function Home() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (files.length === 0) {
      setError('Please upload at least one document');
      return;
    }

    if (!query.trim()) {
      setError('Please enter your investment query');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('query', query);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();
      
      // Store result in sessionStorage for the results page
      sessionStorage.setItem('analysisResult', JSON.stringify(result));
      
      // Navigate to results page
      router.push('/analyze');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🧠 Investment Due Diligence Agent
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Multi-Agent RAG System powered by OpenAI and Pinecone
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Upload financial documents and business plans to receive comprehensive
          investment analysis
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* File Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            📄 Upload Documents
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Upload financial reports, business plans, and related documents
          </p>
          <FileUploader onFilesSelected={setFiles} maxFiles={5} />
        </div>

        {/* Query Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            💭 Investment Query
          </h2>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Should we invest in Company X? What are the key risks and opportunities?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-2">
            Be specific about what you want to analyze or evaluate
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            loading={loading}
            disabled={loading || files.length === 0 || !query.trim()}
            size="lg"
            className="w-full sm:w-auto"
          >
            {loading ? 'Analyzing...' : '🔍 Analyze Investment'}
          </Button>
        </div>
      </form>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Financial Analysis
          </h3>
          <p className="text-sm text-gray-600">
            EBITDA, debt ratios, cash flow, and profitability metrics
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Market Intelligence
          </h3>
          <p className="text-sm text-gray-600">
            Growth rates, competition analysis, and market positioning
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="font-semibold text-gray-900 mb-2">Risk Mitigation</h3>
          <p className="text-sm text-gray-600">
            Comprehensive risk assessment with actionable mitigation strategies
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>© 2025 HenryCodeT | Investment Due Diligence Agent MVP</p>
      </div>
    </div>
  );
}
