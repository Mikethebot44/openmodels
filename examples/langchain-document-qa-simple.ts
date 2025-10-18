import { OpenModelsLLM } from '../integrations/langchain';
import { OpenModelsEmbeddings } from '../integrations/langchain/embeddings';

async function documentQATest() {
  console.log('Testing OpenModels Document Q&A System...\n');

  // Initialize OpenModels components
  const llm = new OpenModelsLLM(
    {
      baseUrl: 'https://mikethebot44--openmodels-text-inference-create-app.modal.run',
    },
    {
      model: 'meta-llama/Llama-3-8b',
      temperature: 0.3,
      maxTokens: 200
    }
  );

  const embeddings = new OpenModelsEmbeddings(
    {
      baseUrl: 'https://mikethebot44--openmodels-embed-inference-create-app.modal.run',
    },
    {
      model: 'sentence-transformers/all-MiniLM-L6-v2'
    }
  );

  // Sample documents
  const documents = [
    'Artificial intelligence is a branch of computer science that aims to create machines capable of intelligent behavior.',
    'Machine learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed.',
    'Deep learning uses neural networks with multiple layers to process data and make decisions.',
    'Natural language processing allows computers to understand, interpret, and generate human language.',
    'Computer vision enables machines to interpret and understand visual information from the world.'
  ];

  try {
    console.log('Creating embeddings for documents...');
    const docEmbeddings = await embeddings.embedDocuments(documents);
    console.log(`Created embeddings for ${docEmbeddings.length} documents`);
    console.log();

    // Test question
    const question = 'What is machine learning?';
    console.log(`Question: ${question}`);
    
    // Get query embedding
    const queryEmbedding = await embeddings.embedQuery(question);
    
    // Find most similar document
    let bestMatch = { index: -1, similarity: -1 };
    for (let i = 0; i < docEmbeddings.length; i++) {
      const similarity = cosineSimilarity(queryEmbedding, docEmbeddings[i]);
      if (similarity > bestMatch.similarity) {
        bestMatch = { index: i, similarity };
      }
    }

    console.log(`Best matching document (similarity: ${bestMatch.similarity.toFixed(4)}):`);
    console.log(`"${documents[bestMatch.index]}"`);
    console.log();

    // Create context-aware prompt
    const context = documents[bestMatch.index];
    const prompt = `Based on the following context, answer the question:

Context: ${context}

Question: ${question}

Answer:`;

    console.log('Generating answer...');
    const answer = await llm.invoke(prompt);
    console.log('Answer:', answer);

    console.log('\n✅ Document Q&A test completed successfully!');

  } catch (error) {
    console.error('❌ Error testing Document Q&A:', error);
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

documentQATest();
