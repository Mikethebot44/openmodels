import { client } from '../src';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function basicChat() {
  const apiKey = process.env.OPENMODELS_API_KEY;

  const openmodels = client({
    baseUrl: 'https://mikethebot44--tryscout-text-create-app.modal.run',
    apiKey: apiKey,
  });

  try {
    const response = await openmodels.chat({
      model: 'microsoft/DialoGPT-medium', // Try different HF models
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello! How are you today?' }
      ],
      max_tokens: 100,
      temperature: 0.7,
      stream: false
    });

    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

basicChat();
