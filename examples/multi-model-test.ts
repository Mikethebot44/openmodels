import { client } from '../src';

async function testMultipleModels() {
  const openmodels = client({
    baseUrl: 'https://mikethebot44--openmodels-text-inference-create-app.modal.run',
  });

  const models = [
    'microsoft/DialoGPT-medium',
    'microsoft/DialoGPT-large', 
    'facebook/blenderbot-400M-distill',
    'EleutherAI/gpt-neo-2.7B'
  ];

  const testMessage = "What is artificial intelligence?";

  for (const modelName of models) {
    console.log(`\n=== Testing ${modelName} ===`);
    
    try {
      const response = await openmodels.chat({
        model: modelName,
        messages: [
          { role: 'user', content: testMessage }
        ],
        max_tokens: 50,
        temperature: 0.7,
        stream: false
      });

      console.log(`Response: ${response.choices[0].message.content}`);
    } catch (error) {
      console.error(`Error with ${modelName}:`, error.message);
    }
  }
}

testMultipleModels();
