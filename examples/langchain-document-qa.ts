import { OpenModelsLLM } from '../integrations/langchain';
import { OpenModelsEmbeddings } from '../integrations/langchain/embeddings';
import { VectorStoreRetrieverMemory } from 'langchain/memory';
import { VectorStore } from 'langchain/vectorstores/base';
import { Document } from 'langchain/document';

// Simple in-memory vector store for demonstration
class SimpleVectorStore extends VectorStore {
  private vectors: number[][] = [];
  private documents: Document[] = [];

  async addVectors(vectors: number[][], documents: Document[]): Promise<void> {
    this.vectors.push(...vectors);
    this.documents.push(...documents);
  }

  async similaritySearchVectorWithScore(
    query: number[],
    k: number
  ): Promise<[Document, number][]> {
    const scores = this.vectors.map((vector, index) => ({
      document: this.documents[index],
      score: this.cosineSimilarity(query, vector)
    }));

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(item => [item.document, item.score]);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  static async fromTexts(
    texts: string[],
    metadatas: any[],
    embeddings: OpenModelsEmbeddings
  ): Promise<SimpleVectorStore> {
    const vectors = await embeddings.embedDocuments(texts);
    const documents = texts.map((text, index) => new Document({
      pageContent: text,
      metadata: metadatas[index] || {}
    }));

    const store = new SimpleVectorStore();
    await store.addVectors(vectors, documents);
    return store;
  }
}

async function documentQAExample() {
  // Initialize OpenModels components
  const llm = new OpenModelsLLM(
    {
      apiKey: process.env.OPENMODELS_API_KEY,
    },
    {
      model: 'microsoft/DialoGPT-medium',
      temperature: 0.3,
      maxTokens: 200
    }
  );

  const embeddings = new OpenModelsEmbeddings(
    {
      apiKey: process.env.OPENMODELS_API_KEY,
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

  const metadatas = documents.map((_, index) => ({ id: index }));

  console.log('Creating vector store...');
  const vectorStore = await SimpleVectorStore.fromTexts(documents, metadatas, embeddings);

  console.log('Vector store created with', documents.length, 'documents.\n');

  // Create retriever memory
  const retriever = vectorStore.asRetriever({ k: 2 });
  const memory = new VectorStoreRetrieverMemory({ retriever });

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question('Ask about AI/ML (or "exit"): ', async (question: string) => {
      if (question.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      try {
        // Get relevant context
        const relevantDocs = await retriever.getRelevantDocuments(question);
        const context = relevantDocs.map(doc => doc.pageContent).join('\n');

        // Create prompt with context
        const prompt = `Based on the following context, answer the question:

Context:
${context}

Question: ${question}

Answer:`;

        const response = await llm.call(prompt);
        console.log('Answer:', response);
        console.log();
        askQuestion();
      } catch (error) {
        console.error('Error:', error);
        askQuestion();
      }
    });
  };

  console.log('Document QA system ready!');
  askQuestion();
}

documentQAExample();
