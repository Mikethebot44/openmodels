import { OpenModelsLLM } from '../integrations/langchain';

async function langchainBetterExample() {
  console.log('Testing OpenModels LangChain Integration with Better Prompting...\n');

  // Initialize OpenModels LLM
  const llm = new OpenModelsLLM(
    {
      baseUrl: 'https://mikethebot44--openmodels-text-inference-create-app.modal.run',
    },
    {
      model: 'EleutherAI/gpt-neo-2.7B',
      temperature: 0.3,
      maxTokens: 150
    }
  );

  try {
    // Test with better prompting
    console.log('Testing with better prompting...');
    const response1 = await llm.invoke('Question: What is the capital of France?\nAnswer:');
    console.log('Response:', response1);
    console.log();

    // Test with different question
    console.log('Testing with different question...');
    const response2 = await llm.invoke('Question: What is machine learning?\nAnswer:');
    console.log('Response:', response2);
    console.log();

    // Test with conversational prompt
    console.log('Testing conversational prompt...');
    const response3 = await llm.invoke('Human: Hello, how are you?\nAssistant:');
    console.log('Response:', response3);
    console.log();

    // Test LLM type and parameters
    console.log('LLM Type:', llm._llmType());
    console.log('Identifying Parameters:', llm._identifyingParams());

    console.log('\n✅ LangChain integration with better prompting completed successfully!');

  } catch (error) {
    console.error('❌ Error testing LangChain integration:', error);
  }
}

langchainBetterExample();
