import type {
  AgentContext,
  AgentOutput,
  DueDiligenceReport,
  FinancialAnalysis,
  MarketAnalysis,
} from '@/types/agent';
import { chatCompletion, extractJSON } from '../openai';

/**
 * Decision Agent - Synthesizes financial and market analysis
 * Produces final investment recommendation with risk mitigation
 */
export async function decisionAgent(
  financialOutput: AgentOutput,
  marketOutput: AgentOutput,
  query: string
): Promise<DueDiligenceReport> {
  console.log('[Decision Agent] Starting synthesis...');

  try {
    const financialAnalysis = financialOutput.result as FinancialAnalysis;
    const marketAnalysis = marketOutput.result as MarketAnalysis;

    const prompt = `You are a senior investment analyst making final due diligence recommendations.

Investment Query: ${query}

FINANCIAL ANALYSIS:
- EBITDA: ${financialAnalysis.ebitda || 'N/A'}
- Debt Ratio: ${financialAnalysis.debtRatio || 'N/A'}
- Cash Flow: ${financialAnalysis.cashFlow}
- Profitability: ${financialAnalysis.profitability}
- Financial Risks: ${financialAnalysis.risks.join(', ')}

MARKET ANALYSIS:
- Growth Rate: ${marketAnalysis.growthRate}
- Competition: ${marketAnalysis.competition}
- Market Share: ${marketAnalysis.marketShare}
- Opportunities: ${marketAnalysis.opportunities.join(', ')}
- Threats: ${marketAnalysis.threats.join(', ')}

Based on this comprehensive analysis, provide your investment recommendation:

1. Recommendation: Choose one of PROCEED, REVIEW, or REJECT
2. Executive Summary: 2-3 sentences explaining your decision
3. Risk Mitigation: Specific, actionable steps (3-5 items) with priority levels
4. Key Citations: Combine most important citations from both analyses

Return your recommendation in this exact JSON format:
{
  "recommendation": "PROCEED" | "REVIEW" | "REJECT",
  "summary": "Executive summary explaining the decision",
  "financialAnalysis": ${JSON.stringify(financialAnalysis)},
  "marketAnalysis": ${JSON.stringify(marketAnalysis)},
  "riskMitigation": [
    {
      "risk": "specific risk identified",
      "mitigation": "actionable mitigation strategy",
      "priority": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "citations": [
    {"source": "source name", "page": number, "quote": "relevant quote"}
  ],
  "timestamp": "${new Date().toISOString()}"
}

Guidelines:
- PROCEED: Strong financials, manageable risks, clear growth path
- REVIEW: Mixed signals, requires additional due diligence
- REJECT: Significant red flags, unacceptable risk level
- Risk mitigation must be specific and actionable
- Include citations for all major claims`;

    const response = await chatCompletion(
      [{ role: 'user', content: prompt }],
      { temperature: 0.3, maxTokens: 2500 }
    );

    const report = extractJSON<DueDiligenceReport>(response);

    // Ensure timestamp is set
    report.timestamp = new Date().toISOString();

    console.log(
      `[Decision Agent] Recommendation: ${report.recommendation}`
    );

    return report;
  } catch (error) {
    console.error('[Decision Agent] Error:', error);
    throw new Error(
      `Decision Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
