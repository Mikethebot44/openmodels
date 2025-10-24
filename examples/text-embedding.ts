import { client } from '../src';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function textEmbedding() {
  const openmodels = client({
    apiKey: process.env.OPENMODELS_API_KEY,
  });

  try {
    const response = await openmodels.embed({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      input: 'The quick brown fox jumps over the lazy dog.',
    });

    console.log('Embedding response:');
    console.log(`Model: ${response.model}`);
    console.log(`Embedding dimensions: ${response.data[0].embedding.length}`);
    console.log(`First 5 values: [${response.data[0].embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
    console.log(`Usage: ${response.usage.prompt_tokens} tokens`);
  } catch (error) {
    console.error('Error:', error);
  }
}

textEmbedding();
