import type { AgentContext, AgentOutput, MarketAnalysis } from '@/types/agent';
import { queryRAG } from '../pinecone';
import { chatCompletion, extractJSON } from '../openai';

/**
 * Market Agent - Analyzes market and business strategy
 * Focuses on: growth rate, competition, market share, opportunities/threats
 */
export async function marketAgent(
  context: AgentContext
): Promise<AgentOutput> {
  console.log('[Market Agent] Starting analysis...');

  try {
    // Query RAG for relevant business plan and market documents
    const ragResults = await queryRAG(
      `${context.query} market growth competition business plan strategy`,
      5,
      { type: 'business_plan' }
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

    // Market analysis prompt
    const prompt = `You are a market research expert analyzing investment opportunities.

Query: ${context.query}

Available Market & Business Documents:
${documentContext}

Analyze the market position and growth potential of this company and provide:
1. Expected growth rate (CAGR or percentage)
2. Competition assessment
3. Current market share
4. Key opportunities
5. Key threats
6. Citations for each claim (use format: [Citation: Source, Page X])

Return your analysis in this exact JSON format:
{
  "growthRate": "X% CAGR or description",
  "competition": "strong/moderate/weak - detailed analysis",
  "marketShare": "percentage or description",
  "opportunities": ["opportunity 1", "opportunity 2"],
  "threats": ["threat 1", "threat 2"],
  "citations": [
    {"source": "Business Plan", "page": 8, "quote": "relevant quote"},
    {"source": "Market Analysis", "page": 3, "quote": "relevant quote"}
  ]
}

Be specific and cite sources for all claims. Focus on concrete market data and competitive dynamics.`;

    const response = await chatCompletion(
      [{ role: 'user', content: prompt }],
      { temperature: 0.2, maxTokens: 1500 }
    );

    const analysis = extractJSON<MarketAnalysis>(response);

    console.log('[Market Agent] Analysis completed successfully');

    return {
      agentName: 'MarketAgent',
      result: analysis,
      citations: analysis.citations || [],
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Market Agent] Error:', error);
    throw new Error(
      `Market Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
