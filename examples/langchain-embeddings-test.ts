import { OpenModelsEmbeddings } from '../integrations/langchain/embeddings';

async function langchainEmbeddingsTest() {
  console.log('Testing OpenModels LangChain Embeddings Integration...\n');

  // Initialize OpenModels Embeddings
  const embeddings = new OpenModelsEmbeddings(
    {
      baseUrl: 'https://mikethebot44--openmodels-embed-inference-create-app.modal.run',
    },
    {
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      encodingFormat: 'float'
    }
  );

  try {
    // Test single query embedding
    console.log('Testing single query embedding...');
    const queryEmbedding = await embeddings.embedQuery('Hello, how are you?');
    console.log('Query embedding dimensions:', queryEmbedding.length);
    console.log('First 5 values:', queryEmbedding.slice(0, 5).map(v => v.toFixed(4)));
    console.log();

    // Test multiple document embeddings
    console.log('Testing multiple document embeddings...');
    const documents = [
      'The quick brown fox jumps over the lazy dog.',
      'Machine learning is a subset of artificial intelligence.',
      'Python is a popular programming language for data science.'
    ];
    
    const docEmbeddings = await embeddings.embedDocuments(documents);
    console.log('Number of documents:', docEmbeddings.length);
    console.log('Each embedding dimensions:', docEmbeddings[0].length);
    console.log('First document first 5 values:', docEmbeddings[0].slice(0, 5).map(v => v.toFixed(4)));
    console.log();

    // Test similarity calculation
    console.log('Testing similarity calculation...');
    const similarity = cosineSimilarity(queryEmbedding, docEmbeddings[0]);
    console.log('Similarity between query and first document:', similarity.toFixed(4));

    console.log('\n✅ LangChain embeddings integration test completed successfully!');

  } catch (error) {
    console.error('❌ Error testing LangChain embeddings integration:', error);
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

langchainEmbeddingsTest();
