import { NextRequest, NextResponse } from 'next/server';
import { registerAgent, invokeAgent } from '@/lib/mcp';
import { financialAgent } from '@/lib/agents/financialAgent';
import { marketAgent } from '@/lib/agents/marketAgent';
import { decisionAgent } from '@/lib/agents/decisionAgent';
import { validateInput, validateOutput, sanitizeInput } from '@/lib/guardrails';
import { upsertDocument } from '@/lib/pinecone';

// Register agents on module load
registerAgent('financial', financialAgent);
registerAgent('market', marketAgent);

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const query = formData.get('query') as string;
    const files = formData.getAll('files') as File[];

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'At least one document is required' },
        { status: 400 }
      );
    }

    // Input validation and sanitization
    const sanitizedQuery = sanitizeInput(query);
    validateInput(sanitizedQuery);

    console.log('[API] Starting analysis for query:', sanitizedQuery);
    console.log('[API] Processing', files.length, 'documents');

    // Process and upload documents to Pinecone
    const documents = [];
    for (const file of files) {
      const text = await file.text();
      const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Determine document type from filename or content
      const type = file.name.toLowerCase().includes('financial')
        ? 'financial'
        : file.name.toLowerCase().includes('business')
        ? 'business_plan'
        : 'other';

      // Upload to Pinecone
      await upsertDocument(documentId, text, {
        name: file.name,
        type,
        source: file.name,
      });

      documents.push({
        id: documentId,
        name: file.name,
        type,
        content: text,
        uploadedAt: new Date().toISOString(),
      });

      console.log(`[API] Uploaded document: ${file.name} (${type})`);
    }

    // Invoke agents through MCP
    const context = {
      query: sanitizedQuery,
      documents,
    };

    console.log('[API] Invoking Financial Agent...');
    const financialOutput = await invokeAgent('financial', context);

    console.log('[API] Invoking Market Agent...');
    const marketOutput = await invokeAgent('market', context);

    console.log('[API] Invoking Decision Agent...');
    const report = await decisionAgent(
      financialOutput,
      marketOutput,
      sanitizedQuery
    );

    // Validate output
    const reportText = JSON.stringify(report);
    validateOutput(reportText);

    console.log('[API] Analysis completed successfully');
    console.log('[API] Recommendation:', report.recommendation);

    return NextResponse.json(report);
  } catch (error) {
    console.error('[API] Error during analysis:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Analysis failed',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
