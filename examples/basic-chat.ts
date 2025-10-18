import { client } from '../src';

async function basicChat() {
  const openmodels = client({
    baseUrl: 'https://mikethebot44--openmodels-text-inference-create-app.modal.run',
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
