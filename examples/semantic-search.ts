import { client } from '../src';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function semanticSearch() {
  const openmodels = client({
    apiKey: process.env.OPENMODELS_API_KEY,
  });

  // Document collection
  const documents = [
    'The Python programming language is widely used for data science and machine learning.',
    'JavaScript is essential for web development and frontend applications.',
    'Machine learning algorithms require large datasets for training.',
    'Web development involves HTML, CSS, and JavaScript technologies.',
    'Data science combines statistics, programming, and domain expertise.',
    'Artificial intelligence is revolutionizing healthcare and medical diagnosis.',
    'Frontend frameworks like React and Vue.js simplify web development.',
    'Deep learning neural networks can recognize patterns in complex data.'
  ];

  const query = 'What technologies are used for building websites?';

  try {
    // Embed all documents
    const docResponse = await openmodels.embed({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      input: documents,
    });

    // Embed the query
    const queryResponse = await openmodels.embed({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      input: query,
    });

    const queryEmbedding = queryResponse.data[0].embedding;

    // Calculate similarities
    const similarities = docResponse.data.map((doc, index) => {
      const docEmbedding = doc.embedding;
      
      // Cosine similarity
      const dotProduct = queryEmbedding.reduce((sum, val, i) => sum + val * docEmbedding[i], 0);
      const queryMagnitude = Math.sqrt(queryEmbedding.reduce((sum, val) => sum + val * val, 0));
      const docMagnitude = Math.sqrt(docEmbedding.reduce((sum, val) => sum + val * val, 0));
      const similarity = dotProduct / (queryMagnitude * docMagnitude);
      
      return {
        index,
        text: documents[index],
        similarity
      };
    });

    // Sort by similarity (highest first)
    similarities.sort((a, b) => b.similarity - a.similarity);

    console.log(`Query: "${query}"`);
    console.log('\nMost relevant documents:');
    console.log('='.repeat(50));
    
    similarities.slice(0, 3).forEach((item, i) => {
      console.log(`${i + 1}. Similarity: ${item.similarity.toFixed(4)}`);
      console.log(`   Text: ${item.text}`);
      console.log();
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

semanticSearch();
