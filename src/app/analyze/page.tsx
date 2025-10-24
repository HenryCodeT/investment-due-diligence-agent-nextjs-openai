'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DueDiligenceReport } from '@/types/agent';
import { Button } from '@/components/Button';

export default function AnalyzePage() {
  const router = useRouter();
  const [report, setReport] = useState<DueDiligenceReport | null>(null);

  useEffect(() => {
    const savedResult = sessionStorage.getItem('analysisResult');
    if (savedResult) {
      setReport(JSON.parse(savedResult));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'PROCEED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'REVIEW':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'REJECT':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="secondary"
          onClick={() => router.push('/')}
          className="mb-4"
        >
          ← New Analysis
        </Button>
        <h1 className="text-4xl font-bold text-gray-900">
          Due Diligence Report
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Generated: {new Date(report.timestamp).toLocaleString()}
        </p>
      </div>

      {/* Recommendation Badge */}
      <div
        className={`inline-flex items-center px-6 py-3 rounded-lg border-2 text-xl font-bold mb-8 ${getRecommendationColor(
          report.recommendation
        )}`}
      >
        <span className="text-2xl mr-3">
          {report.recommendation === 'PROCEED'
            ? '✅'
            : report.recommendation === 'REVIEW'
            ? '⚠️'
            : '❌'}
        </span>
        {report.recommendation}
      </div>

      {/* Executive Summary */}
      <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          📋 Executive Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">{report.summary}</p>
      </section>

      {/* Financial Analysis */}
      <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          💰 Financial Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">EBITDA</p>
            <p className="text-2xl font-bold text-gray-900">
              {report.financialAnalysis.ebitda !== null
                ? `${report.financialAnalysis.ebitda}%`
                : 'N/A'}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Debt Ratio</p>
            <p className="text-2xl font-bold text-gray-900">
              {report.financialAnalysis.debtRatio !== null
                ? report.financialAnalysis.debtRatio
                : 'N/A'}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Cash Flow</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">
              {report.financialAnalysis.cashFlow}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Profitability</h3>
          <p className="text-gray-700">
            {report.financialAnalysis.profitability}
          </p>
        </div>
        {report.financialAnalysis.risks.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Financial Risks</h3>
            <ul className="list-disc list-inside space-y-1">
              {report.financialAnalysis.risks.map((risk, idx) => (
                <li key={idx} className="text-gray-700">
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Market Analysis */}
      <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          📊 Market Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
            <p className="text-lg font-semibold text-gray-900">
              {report.marketAnalysis.growthRate}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Market Share</p>
            <p className="text-lg font-semibold text-gray-900">
              {report.marketAnalysis.marketShare}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Competition</h3>
          <p className="text-gray-700">{report.marketAnalysis.competition}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Opportunities
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {report.marketAnalysis.opportunities.map((opp, idx) => (
                <li key={idx} className="text-gray-700">
                  {opp}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Threats</h3>
            <ul className="list-disc list-inside space-y-1">
              {report.marketAnalysis.threats.map((threat, idx) => (
                <li key={idx} className="text-gray-700">
                  {threat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Risk Mitigation */}
      <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          🛡️ Risk Mitigation Strategy
        </h2>
        <div className="space-y-4">
          {report.riskMitigation.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex-1">
                  {item.risk}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                    item.priority
                  )}`}
                >
                  {item.priority}
                </span>
              </div>
              <p className="text-gray-700">{item.mitigation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Citations */}
      {report.citations.length > 0 && (
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            📚 Citations
          </h2>
          <div className="space-y-3">
            {report.citations.map((citation, idx) => (
              <div key={idx} className="border-l-4 border-primary-500 pl-4">
                <p className="text-sm font-semibold text-gray-900">
                  {citation.source}
                  {citation.page && ` - Page ${citation.page}`}
                </p>
                <p className="text-sm text-gray-600 italic">
                  "{citation.quote}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Export Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => {
            const dataStr = JSON.stringify(report, null, 2);
            const dataBlob = new Blob([dataStr], {
              type: 'application/json',
            });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `due-diligence-report-${Date.now()}.json`;
            link.click();
          }}
        >
          📥 Export Report (JSON)
        </Button>
      </div>
    </div>
  );
}
