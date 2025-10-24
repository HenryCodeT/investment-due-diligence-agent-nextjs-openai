import type { AgentContext, AgentOutput, FinancialAnalysis } from '@/types/agent';
import { queryRAG } from '../pinecone';
import { chatCompletion, extractJSON } from '../openai';

/**
 * Financial Agent - Analyzes financial documents
 * Focuses on: EBITDA, debt ratios, cash flow, profitability
 */
export async function financialAgent(
  context: AgentContext
): Promise<AgentOutput> {
  console.log('[Financial Agent] Starting analysis...');

  try {
    // Query RAG for relevant financial documents
    const ragResults = await queryRAG(
      `${context.query} financial metrics EBITDA debt cash flow`,
      5,
      { type: 'financial' }
    );

    // Build context from RAG results
    const documentContext = ragResults
      .map(
        (match, idx) =>
          `Document ${idx + 1} (Score: ${match.score?.toFixed(2)}):
${match.metadata?.text || 'No content'}
Source: ${match.metadata?.source || 'Unknown'}
Page: ${match.metadata?.page || 'N/A'}
---`
      )
      .join('\n\n');

    // Financial analysis prompt
    const prompt = `You are a financial due diligence expert analyzing investment opportunities.

Query: ${context.query}

Available Financial Documents:
${documentContext}

Analyze the financial health of this company and provide:
1. EBITDA percentage (if available)
2. Debt ratio (debt-to-equity or total debt)
3. Cash flow assessment
4. Profitability analysis
5. Key financial risks
6. Citations for each claim (use format: [Citation: Source, Page X])

Return your analysis in this exact JSON format:
{
  "ebitda": number or null,
  "debtRatio": number or null,
  "cashFlow": "strong/moderate/weak/unknown",
  "profitability": "detailed analysis",
  "risks": ["risk 1", "risk 2"],
  "citations": [
    {"source": "Financial Report", "page": 4, "quote": "relevant quote"},
    {"source": "Business Plan", "page": 8, "quote": "relevant quote"}
  ]
}

Be specific and cite sources for all claims. If data is not available, mark as null or "unknown".`;

    const response = await chatCompletion(
      [{ role: 'user', content: prompt }],
      { temperature: 0.2, maxTokens: 1500 }
    );

    const analysis = extractJSON<FinancialAnalysis>(response);

    console.log('[Financial Agent] Analysis completed successfully');

    return {
      agentName: 'FinancialAgent',
      result: analysis,
      citations: analysis.citations || [],
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Financial Agent] Error:', error);
    throw new Error(
      `Financial Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
