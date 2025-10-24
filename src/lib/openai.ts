import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embeddings for a text document
 */
export async function embedDocument(text: string): Promise<number[]> {
  try {
    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      dimensions:1024,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('[OpenAI] Embedding error:', error);
    throw new Error('Failed to generate embeddings');
  }
}

/**
 * Chat completion with OpenAI
 */
export async function chatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const {
    model = 'gpt-4o-mini',
    temperature = 0.2,
    maxTokens = 2000,
  } = options;

  try {
    const response = await client.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    return response.choices[0].message?.content || '';
  } catch (error) {
    console.error('[OpenAI] Chat completion error:', error);
    throw new Error('Failed to generate chat completion');
  }
}

/**
 * Extract structured JSON from LLM response
 */
export function extractJSON<T>(response: string): T {
  try {
    // Try to find JSON in markdown code blocks
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    
    // Try to parse directly
    return JSON.parse(response);
  } catch (error) {
    console.error('[OpenAI] JSON extraction error:', error);
    throw new Error('Failed to extract JSON from response');
  }
}

export { client };
