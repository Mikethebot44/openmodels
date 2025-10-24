import { OpenModelsLLM } from '../integrations/langchain';

async function langchainExample() {
  console.log('Testing OpenModels LangChain Integration...\n');

  // Initialize OpenModels LLM
  const llm = new OpenModelsLLM(
    {
      apiKey: process.env.OPENMODELS_API_KEY,
    },
    {
      model: 'EleutherAI/gpt-neo-2.7B',
      temperature: 0.3,
      maxTokens: 200
    }
  );

  try {
    // Test basic LLM call
    console.log('Testing basic LLM call...');
    const response = await llm.invoke('Hello! How are you today?');
    console.log('Response:', response);
    console.log();

    // Test with different prompt
    console.log('Testing with different prompt...');
    const response2 = await llm.invoke('What is the capital of France?');
    console.log('Response:', response2);
    console.log();

    // Test LLM type
    console.log('LLM Type:', llm._llmType());
    
    // Test identifying parameters
    console.log('Identifying Parameters:', llm._identifyingParams());

    console.log('\n✅ LangChain integration test completed successfully!');

  } catch (error) {
    console.error('❌ Error testing LangChain integration:', error);
  }
}

langchainExample();
