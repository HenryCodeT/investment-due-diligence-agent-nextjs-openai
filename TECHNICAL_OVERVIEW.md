# Investment Due Diligence Agent - Technical Overview

## System Design Principles

### 1. Multi-Agent Architecture
The system employs a coordinated multi-agent approach where specialized agents handle distinct aspects of the analysis:

- **Separation of Concerns**: Each agent has a clear, focused responsibility
- **Composability**: Agents can be easily added, removed, or modified
- **Auditability**: Every agent interaction is logged through MCP

### 2. RAG (Retrieval-Augmented Generation)
The system uses Pinecone for document retrieval:

```
User Query → Embedding → Vector Search → Top K Results → Context → LLM
```

Benefits:
- Grounds LLM responses in actual document content
- Reduces hallucination
- Enables citation tracking
- Supports large document sets

### 3. Guardrails Pattern
Input and output validation ensures:

- **Input Safety**: Sanitization, validation, length limits
- **Output Quality**: Required sections, citation presence
- **Security**: XSS prevention, file type validation

### 4. MCP (Model Context Protocol)
Custom toolkit for agent management:

```typescript
registerAgent(name, fn) → Register agent function
invokeAgent(name, ctx) → Execute with logging
getAgentLogs() → Retrieve audit trail
getAgentStats() → Performance metrics
```

## Data Flow

### Document Processing Pipeline

```
1. File Upload
   ↓
2. Text Extraction
   ↓
3. Chunking (if needed)
   ↓
4. Embedding Generation (OpenAI)
   ↓
5. Vector Storage (Pinecone)
   ↓
6. Metadata Indexing
```

### Analysis Pipeline

```
1. Query Received
   ↓
2. Input Guardrail
   ↓
3. Query Embedding
   ↓
4. RAG Retrieval (Financial Docs)
   ↓
5. Financial Agent Analysis
   ↓
6. RAG Retrieval (Business Docs)
   ↓
7. Market Agent Analysis
   ↓
8. Decision Agent Synthesis
   ↓
9. Output Guardrail
   ↓
10. Report Generation
```

## Agent Implementation Details

### Financial Agent

**Input:**
- User query
- Document context from RAG

**Process:**
1. Query Pinecone for financial documents
2. Build context with top 5 results
3. Prompt LLM with structured format
4. Extract JSON response
5. Validate citations

**Output:**
```typescript
{
  ebitda: number | null,
  debtRatio: number | null,
  cashFlow: string,
  profitability: string,
  risks: string[],
  citations: Citation[]
}
```

### Market Agent

**Input:**
- User query
- Document context from RAG

**Process:**
1. Query Pinecone for market/business documents
2. Build context with top 5 results
3. Prompt LLM with structured format
4. Extract JSON response
5. Validate citations

**Output:**
```typescript
{
  growthRate: string,
  competition: string,
  marketShare: string,
  opportunities: string[],
  threats: string[],
  citations: Citation[]
}
```

### Decision Agent

**Input:**
- Financial agent output
- Market agent output
- Original query

**Process:**
1. Synthesize both analyses
2. Apply decision logic
3. Generate risk mitigation strategies
4. Consolidate citations
5. Format final report

**Output:**
```typescript
{
  recommendation: 'PROCEED' | 'REVIEW' | 'REJECT',
  summary: string,
  financialAnalysis: FinancialAnalysis,
  marketAnalysis: MarketAnalysis,
  riskMitigation: RiskMitigation[],
  citations: Citation[],
  timestamp: string
}
```

## Decision Logic

### PROCEED
- Strong financials (EBITDA > 12%, Debt Ratio < 1.0)
- Clear growth path (Growth > 8% CAGR)
- Manageable competition
- Risk mitigation strategies identified

### REVIEW
- Mixed signals (some metrics strong, others weak)
- Moderate to high competition
- Regulatory uncertainty
- Requires additional due diligence

### REJECT
- Poor financials (negative margins, high debt)
- Declining market
- Insurmountable competitive disadvantages
- Unacceptable risk levels

## Performance Considerations

### Latency
Typical analysis time: 15-30 seconds
- Document embedding: 2-5s
- RAG queries: 1-2s each
- LLM inference: 5-10s per agent
- Total: 3 agents × 7s avg = ~21s

### Optimization Strategies
1. **Parallel Agent Execution**: Run Financial + Market agents concurrently
2. **Caching**: Cache embeddings for repeat documents
3. **Batch Processing**: Process multiple queries together
4. **Streaming**: Stream LLM responses for better UX

### Cost Estimation (per analysis)
- Embeddings: ~$0.001 (per 1K tokens × 10K avg)
- LLM Calls: ~$0.02 (3 agents × 2K tokens each)
- Pinecone: ~$0.001 (query costs)
- **Total: ~$0.02-0.03 per analysis**

## Security Best Practices

1. **API Key Management**
   - Store in environment variables
   - Never commit to version control
   - Rotate regularly

2. **Input Validation**
   - Sanitize all user inputs
   - Validate file types and sizes
   - Check for malicious content

3. **Output Filtering**
   - Scan for PII (SSN, credit cards)
   - Remove sensitive information
   - Validate structure

4. **Access Control**
   - Implement authentication (future)
   - Rate limiting per user
   - Audit logging

## Testing Strategy

### Unit Tests
Test individual functions:
- Embedding generation
- RAG queries
- JSON extraction
- Validation functions

### Integration Tests
Test agent pipelines:
- Financial agent end-to-end
- Market agent end-to-end
- Decision agent with mocked inputs

### Evaluation Tests
Test business logic:
- Scenario-based evaluation
- Expected output validation
- Citation presence checks

### Example Test

```typescript
describe('Financial Agent', () => {
  it('should identify debt risk from high debt ratio', async () => {
    const mockDoc = { debtRatio: 2.5, ... };
    const result = await financialAgent(mockDoc);
    
    expect(result.risks).toContain('debt');
    expect(result.citations.length).toBeGreaterThan(0);
  });
});
```

## Monitoring & Observability

### Metrics to Track
1. **Usage Metrics**
   - Analyses per day
   - Average processing time
   - Success/failure rate

2. **Quality Metrics**
   - Citations per report
   - Risk mitigations per report
   - User feedback scores

3. **System Metrics**
   - API response times
   - Error rates by type
   - Token usage

### Logging Strategy

```typescript
// Structure logs for easy parsing
console.log({
  timestamp: new Date().toISOString(),
  level: 'INFO',
  agent: 'FinancialAgent',
  action: 'analysis_complete',
  duration_ms: 5234,
  citations_count: 3
});
```

## Future Enhancements

### Short Term (1-3 months)
- [ ] Add caching layer (Redis)
- [ ] Implement user authentication
- [ ] Add more evaluation scenarios
- [ ] Export reports as PDF
- [ ] Improve error messages

### Medium Term (3-6 months)
- [ ] Add Legal Agent for contract analysis
- [ ] Implement team collaboration features
- [ ] Add comparison mode (multiple companies)
- [ ] Create mobile app
- [ ] Add real-time market data integration

### Long Term (6-12 months)
- [ ] Multi-language support
- [ ] Advanced visualization dashboard
- [ ] Predictive modeling
- [ ] Industry-specific templates
- [ ] API for external integrations

## Troubleshooting

### Common Issues

**Issue**: "Failed to generate embeddings"
- Check OpenAI API key is valid
- Verify API quota not exceeded
- Check network connectivity

**Issue**: "Pinecone query failed"
- Verify index exists and is ready
- Check API key and environment
- Ensure dimensions match (3072)

**Issue**: "Agent output missing citations"
- Review prompt engineering
- Check LLM temperature (should be low)
- Validate document content quality

**Issue**: "Analysis takes too long"
- Check document sizes
- Monitor API rate limits
- Consider implementing timeout

## Contributing Guidelines

1. **Code Style**
   - Use TypeScript strict mode
   - Follow Airbnb style guide
   - Add JSDoc comments for public functions

2. **Pull Request Process**
   - Create feature branch
   - Add tests for new features
   - Update documentation
   - Request review from maintainer

3. **Commit Messages**
   ```
   feat: Add legal agent for contract analysis
   fix: Resolve citation extraction bug
   docs: Update API documentation
   test: Add evaluation scenarios
   ```

## Resources & References

### Documentation
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Pinecone Docs](https://docs.pinecone.io)
- [Next.js Docs](https://nextjs.org/docs)

### Research Papers
- "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
- "Constitutional AI: Harmlessness from AI Feedback"
- "Multi-Agent Systems for Complex Problem Solving"

### Community
- GitHub Issues for bug reports
- Discussions for feature requests
- Discord/Slack for community support

---

**Last Updated**: October 2025  
**Version**: 1.0.0 (MVP)
