import { client } from '../src';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function batchEmbedding() {
  const openmodels = client({
    apiKey: process.env.OPENMODELS_API_KEY,
  });

  const texts = [
    'Artificial intelligence is transforming the world.',
    'Machine learning algorithms can process vast amounts of data.',
    'Natural language processing enables computers to understand human language.',
    'Computer vision allows machines to interpret visual information.',
    'Deep learning networks mimic the human brain structure.'
  ];

  try {
    const response = await openmodels.embed({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      input: texts,
    });

    console.log('Batch embedding response:');
    console.log(`Model: ${response.model}`);
    console.log(`Number of embeddings: ${response.data.length}`);
    console.log(`Each embedding has ${response.data[0].embedding.length} dimensions`);
    console.log(`Total tokens: ${response.usage.total_tokens}`);
    
    // Show similarity between first two texts
    const embedding1 = response.data[0].embedding;
    const embedding2 = response.data[1].embedding;
    
    // Calculate cosine similarity
    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
    const similarity = dotProduct / (magnitude1 * magnitude2);
    
    console.log(`\nSimilarity between texts 1 & 2: ${similarity.toFixed(4)}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

batchEmbedding();
