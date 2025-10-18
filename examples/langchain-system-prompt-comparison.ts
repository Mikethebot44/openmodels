import { OpenModelsLLM } from '../integrations/langchain';

async function systemPromptComparison() {
  console.log('Comparing LangChain Integration: With vs Without System Prompts\n');

  const question = 'What is the capital of France?';

  // LLM without system prompt
  const llmWithoutSystem = new OpenModelsLLM(
    {
      baseUrl: 'https://mikethebot44--openmodels-text-inference-create-app.modal.run',
    },
    {
      model: 'EleutherAI/gpt-neo-2.7B',
      temperature: 0.3,
      maxTokens: 100
      // No system prompt
    }
  );

  // LLM with system prompt
  const llmWithSystem = new OpenModelsLLM(
    {
      baseUrl: 'https://mikethebot44--openmodels-text-inference-create-app.modal.run',
    },
    {
      model: 'EleutherAI/gpt-neo-2.7B',
      temperature: 0.3,
      maxTokens: 100,
      systemPrompt: 'You are a helpful assistant. Answer questions directly and concisely.'
    }
  );

  try {
    console.log(`Question: ${question}\n`);

    // Test without system prompt
    console.log('1. WITHOUT System Prompt:');
    const responseWithout = await llmWithoutSystem.invoke(question);
    console.log('Response:', responseWithout.split('\n')[0]); // First line only
    console.log();

    // Test with system prompt
    console.log('2. WITH System Prompt:');
    const responseWith = await llmWithSystem.invoke(question);
    console.log('Response:', responseWith.split('\n')[0]); // First line only
    console.log();

    // Show the difference in parameters
    console.log('3. Parameter Comparison:');
    console.log('Without System Prompt:', llmWithoutSystem._identifyingParams().systemPrompt || 'None');
    console.log('With System Prompt:', llmWithSystem._identifyingParams().systemPrompt);
    console.log();

    console.log('✅ System prompt comparison completed!');
    console.log('📝 Note: System prompts help guide the model\'s behavior and responses.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

systemPromptComparison();
