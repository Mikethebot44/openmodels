import { OpenModelsLLM } from '../integrations/langchain';
import { ConversationChain } from '@langchain/core/chains';
import { BufferMemory } from '@langchain/core/memory';

async function langchainExample() {
  // Initialize OpenModels LLM
  const llm = new OpenModelsLLM(
    {
      apiKey: process.env.OPENMODELS_API_KEY,
    },
    {
      model: 'microsoft/DialoGPT-medium',
      temperature: 0.7,
      maxTokens: 150
    }
  );

  // Create a conversation chain with memory
  const memory = new BufferMemory();
  const chain = new ConversationChain({ llm, memory });

  console.log('Starting LangChain conversation...');
  console.log('Type "exit" to quit.\n');

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question('You: ', async (input: string) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      try {
        const response = await chain.call({ input });
        console.log('AI:', response.response);
        console.log();
        askQuestion();
      } catch (error) {
        console.error('Error:', error);
        askQuestion();
      }
    });
  };

  askQuestion();
}

langchainExample();
