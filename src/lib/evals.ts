import type { EvalScenario, EvalResult } from '@/types/agent';
import evals from '../data/evals.json';

/**
 * Run evaluation for a specific scenario
 */
export function runEval(
  agentOutput: string,
  scenarioId: number
): EvalResult {
  const scenario = evals.find(
    (e: EvalScenario) => e.id === scenarioId
  ) as EvalScenario;

  if (!scenario) {
    throw new Error(`Scenario ${scenarioId} not found`);
  }

  console.log(`[Eval] Running scenario ${scenarioId}: ${scenario.scenario}`);

  const passedCriteria: string[] = [];
  const failedCriteria: string[] = [];

  scenario.pass_criteria.forEach((criteria: string) => {
    if (agentOutput.toLowerCase().includes(criteria.toLowerCase())) {
      passedCriteria.push(criteria);
    } else {
      failedCriteria.push(criteria);
    }
  });

  const passed = failedCriteria.length === 0;

  const result: EvalResult = {
    scenarioId,
    passed,
    details: passed
      ? `✓ All criteria passed: ${passedCriteria.join(', ')}`
      : `✗ Failed criteria: ${failedCriteria.join(', ')}. Passed: ${passedCriteria.join(', ')}`,
  };

  console.log(`[Eval] Result:`, result);

  return result;
}

/**
 * Run all evaluations
 */
export function runAllEvals(agentOutput: string): EvalResult[] {
  console.log('[Eval] Running all evaluation scenarios...');

  const results = evals.map((scenario: EvalScenario) =>
    runEval(agentOutput, scenario.id)
  );

  const passed = results.filter(r => r.passed).length;
  const total = results.length;

  console.log(`[Eval] Summary: ${passed}/${total} scenarios passed`);

  return results;
}

/**
 * Generate eval report
 */
export function generateEvalReport(results: EvalResult[]): string {
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = ((passed / total) * 100).toFixed(1);

  let report = `# Evaluation Report\n\n`;
  report += `**Overall Score:** ${passed}/${total} (${percentage}%)\n\n`;

  results.forEach(result => {
    const scenario = evals.find(
      (e: EvalScenario) => e.id === result.scenarioId
    ) as EvalScenario;
    const status = result.passed ? '✓ PASS' : '✗ FAIL';

    report += `## Scenario ${result.scenarioId}: ${status}\n`;
    report += `**Description:** ${scenario.scenario}\n`;
    report += `**Expected Risk:** ${scenario.expected_risk}\n`;
    report += `**Result:** ${result.details}\n\n`;
  });

  return report;
}
