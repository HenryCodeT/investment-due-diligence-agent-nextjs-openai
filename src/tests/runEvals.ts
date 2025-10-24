import { runAllEvals, generateEvalReport } from '../lib/evals';

/**
 * Simple test runner for evaluation scenarios
 * Run with: npm run test:evals
 */

// Mock agent output for testing
const mockAgentOutput = `
# Due Diligence Report

## Recommendation: REVIEW

### Summary
Company X shows strong financial metrics with EBITDA of 15% and manageable debt ratio of 0.7.
However, the market faces significant competition and regulatory uncertainty in LATAM regions.

### Financial Analysis
- Strong cash flow generation
- Healthy debt levels
- Key financial risk: Currency fluctuation exposure [Citation: Financial Report, Page 4]

### Market Analysis
- Growth rate: 10% CAGR expected
- Moderate to strong competition in core markets [Citation: Business Plan, Page 8]
- Market share: 12% in primary segment

### Risk Mitigation
1. **Debt Risk** (HIGH): Monitor debt covenants and maintain liquidity buffers
   - Mitigation: Establish credit facility backup, quarterly covenant reviews
   
2. **Market Decline Risk** (MEDIUM): Diversify revenue streams
   - Mitigation: Expand into adjacent markets, develop new product lines
   
3. **Competition Risk** (MEDIUM): Strengthen competitive positioning
   - Mitigation: Increase R&D investment, enhance customer retention programs

### Citations
[Citation: Financial Report, Page 4] - "EBITDA margin has grown from 12% to 15% over past 3 years"
[Citation: Business Plan, Page 8] - "Market expected to grow at 10% CAGR through 2027"
`;

console.log('='.repeat(60));
console.log('Investment Due Diligence Agent - Evaluation Test');
console.log('='.repeat(60));
console.log('');

try {
  const results = runAllEvals(mockAgentOutput);
  const report = generateEvalReport(results);
  
  console.log(report);
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  if (passed === total) {
    console.log('✅ All evaluation scenarios passed!');
    process.exit(0);
  } else {
    console.log(`⚠️  ${total - passed} scenario(s) failed`);
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Evaluation failed:', error);
  process.exit(1);
}
