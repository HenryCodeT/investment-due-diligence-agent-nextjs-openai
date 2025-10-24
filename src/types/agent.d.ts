// Agent Types
export interface AgentContext {
  query: string;
  documents?: Document[];
  previousOutputs?: Record<string, any>;
}

export interface AgentOutput {
  agentName: string;
  result: any;
  citations: Citation[];
  timestamp: string;
}

export interface Citation {
  source: string;
  page?: number;
  quote: string;
}

export interface FinancialAnalysis {
  ebitda: number | null;
  debtRatio: number | null;
  cashFlow: string;
  profitability: string;
  risks: string[];
  citations: Citation[];
}

export interface MarketAnalysis {
  growthRate: string;
  competition: string;
  marketShare: string;
  opportunities: string[];
  threats: string[];
  citations: Citation[];
}

export interface DueDiligenceReport {
  recommendation: 'PROCEED' | 'REVIEW' | 'REJECT';
  summary: string;
  financialAnalysis: FinancialAnalysis;
  marketAnalysis: MarketAnalysis;
  riskMitigation: RiskMitigation[];
  citations: Citation[];
  timestamp: string;
}

export interface RiskMitigation {
  risk: string;
  mitigation: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Document {
  id: string;
  name: string;
  type: 'financial' | 'business_plan' | 'other';
  content: string;
  uploadedAt: string;
}

// MCP Types
export type AgentFn = (context: AgentContext) => Promise<AgentOutput>;

export interface MCPLog {
  agentName: string;
  action: string;
  context: any;
  result: any;
  timestamp: string;
}

// Evaluation Types
export interface EvalScenario {
  id: number;
  scenario: string;
  expected_risk: string;
  pass_criteria: string[];
}

export interface EvalResult {
  scenarioId: number;
  passed: boolean;
  details: string;
}
