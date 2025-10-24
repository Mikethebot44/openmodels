import { client } from '../src';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function streamingChat() {
  const openmodels = client({
    apiKey: process.env.OPENMODELS_API_KEY,
  });

  try {
    const stream = await openmodels.chat({
      model: 'microsoft/DialoGPT-medium', // Try different HF models
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Tell me a joke!' }
      ],
      max_tokens: 100,
      temperature: 0.8,
      stream: true
    }) as AsyncGenerator<string, void, unknown>;

    console.log('Streaming response:');
    for await (const token of stream) {
      process.stdout.write(token);
    }
    console.log('\n\nStream completed!');
  } catch (error) {
    console.error('Error:', error);
  }
}

streamingChat();
