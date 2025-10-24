/**
 * Guardrails - Input/Output Validation and Security
 */

/**
 * Validate input query
 */
export function validateInput(query: string): void {
  if (!query || query.trim().length === 0) {
    throw new Error('[Guardrail] Query cannot be empty');
  }

  if (query.length > 1000) {
    throw new Error('[Guardrail] Query exceeds maximum length of 1000 characters');
  }

  // Check for investment-related keywords
  const investmentKeywords = [
    'invest',
    'investment',
    'due diligence',
    'company',
    'business',
    'financial',
    'market',
    'analysis',
    'opportunity',
  ];

  const hasInvestmentContext = investmentKeywords.some(keyword =>
    query.toLowerCase().includes(keyword)
  );

  if (!hasInvestmentContext) {
    console.warn(
      '[Guardrail] Query may not be investment-related. Proceeding with caution.'
    );
  }

  console.log('[Guardrail] Input validation passed');
}

/**
 * Validate output from Decision Agent
 */
export function validateOutput(output: string): void {
  if (!output || output.trim().length === 0) {
    throw new Error('[Guardrail] Output cannot be empty');
  }

  try {
    // Parse JSON output
    const report = JSON.parse(output);
    
    // Check for required fields in JSON structure
    const requiredFields = [
      { name: 'recommendation', value: report.recommendation },
      { name: 'summary', value: report.summary },
      { name: 'riskMitigation', value: report.riskMitigation },
      { name: 'citations', value: report.citations }
    ];

    const missingFields = requiredFields.filter(
      field => !field.value || (Array.isArray(field.value) && field.value.length === 0)
    );

    if (missingFields.length > 0) {
      const missing = missingFields.map(f => f.name).join(', ');
      throw new Error(
        `[Guardrail] Output missing required fields: ${missing}`
      );
    }

    // Validate recommendation value
    const validRecommendations = ['PROCEED', 'REVIEW', 'REJECT'];
    if (!validRecommendations.includes(report.recommendation)) {
      throw new Error(
        `[Guardrail] Invalid recommendation: ${report.recommendation}. Must be one of: ${validRecommendations.join(', ')}`
      );
    }

    console.log('[Guardrail] Output validation passed');
  } catch (error) {
    if (error instanceof Error && error.message.includes('[Guardrail]')) {
      throw error;
    }
    throw new Error(`[Guardrail] Invalid JSON output: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  // Remove potential injection patterns
  let sanitized = input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');

  return sanitized.trim();
}

/**
 * Validate document upload
 */
export function validateDocument(
  file: File,
  maxSizeMB: number = 10
): void {
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      '[Guardrail] Invalid file type. Only PDF, TXT, DOC, and DOCX are allowed'
    );
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(
      `[Guardrail] File size exceeds ${maxSizeMB}MB limit`
    );
  }

  console.log('[Guardrail] Document validation passed');
}

/**
 * Check for sensitive data in output
 */
export function checkSensitiveData(output: string): string[] {
  const warnings: string[] = [];

  // Check for potential PII patterns
  const patterns = [
    { name: 'SSN', regex: /\b\d{3}-\d{2}-\d{4}\b/ },
    { name: 'Credit Card', regex: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/ },
    { name: 'Email', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/ },
  ];

  patterns.forEach(pattern => {
    if (pattern.regex.test(output)) {
      warnings.push(`Potential ${pattern.name} detected in output`);
    }
  });

  if (warnings.length > 0) {
    console.warn('[Guardrail] Sensitive data warnings:', warnings);
  }

  return warnings;
}
