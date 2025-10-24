import { Pinecone } from '@pinecone-database/pinecone';
import { embedDocument } from './openai';

if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY is not set in environment variables');
}

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const indexName = process.env.PINECONE_INDEX_NAME || 'investment-due-diligence';

/**
 * Get or create Pinecone index
 */
export async function getIndex() {
  try {
    const index = pinecone.index(indexName);
    return index;
  } catch (error) {
    console.error('[Pinecone] Index access error:', error);
    throw new Error(`Failed to access index: ${indexName}`);
  }
}

/**
 * Upsert document vectors to Pinecone
 */
export async function upsertDocument(
  documentId: string,
  text: string,
  metadata: Record<string, any>
): Promise<void> {
  try {
    const embedding = await embedDocument(text);
    const index = await getIndex();

    await index.upsert([
      {
        id: documentId,
        values: embedding,
        metadata: {
          ...metadata,
          text,
          uploadedAt: new Date().toISOString(),
        },
      },
    ]);

    console.log(`[Pinecone] Document ${documentId} upserted successfully`);
  } catch (error) {
    console.error('[Pinecone] Upsert error:', error);
    throw new Error('Failed to upsert document to Pinecone');
  }
}

/**
 * Query RAG - Retrieve relevant documents
 */
export async function queryRAG(
  query: string,
  topK: number = 5,
  filter?: Record<string, any>
): Promise<any[]> {
  try {
    const embedding = await embedDocument(query);
    const index = await getIndex();

    const queryResponse = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
      filter,
    });

    return queryResponse.matches || [];
  } catch (error) {
    console.error('[Pinecone] Query error:', error);
    throw new Error('Failed to query Pinecone');
  }
}

/**
 * Delete document from Pinecone
 */
export async function deleteDocument(documentId: string): Promise<void> {
  try {
    const index = await getIndex();
    await index.deleteOne(documentId);
    console.log(`[Pinecone] Document ${documentId} deleted`);
  } catch (error) {
    console.error('[Pinecone] Delete error:', error);
    throw new Error('Failed to delete document from Pinecone');
  }
}

export { pinecone };
