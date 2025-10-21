import { client } from '../src';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function multiTaskDemo() {
  const apiKey = process.env.OPENMODELS_API_KEY;

  const openmodels = client({
    baseUrl: 'https://tryscout.dev', // Your Next.js app URL
    apiKey: apiKey,
  });

  try {
    console.log('=== Multi-Task Demo ===\n');

    // 1. Text Generation
    console.log('1. Text Generation:');
    const textResponse = await openmodels.run({
      task: 'text-generation',
      model: 'microsoft/DialoGPT-medium',
      messages: [
        { role: 'user', content: 'What is machine learning?' }
      ],
      max_tokens: 100
    });
    console.log(`Response: ${textResponse.choices[0].message.content}\n`);

    // 2. Image Classification
    console.log('2. Image Classification:');
    const visionResponse = await openmodels.run({
      task: 'image-classification',
      model: 'google/vit-base-patch16-224',
      input: 'https://example.com/cat.jpg', // Replace with actual image
      top_k: 3
    });
    console.log('Top classifications:');
    visionResponse.classifications.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.label} (${(c.score * 100).toFixed(1)}%)`);
    });
    console.log('');

    // 3. Audio Transcription
    console.log('3. Audio Transcription:');
    const audioResponse = await openmodels.run({
      task: 'audio-transcribe',
      model: 'openai/whisper-base',
      input: 'https://example.com/speech.wav', // Replace with actual audio
      language: 'en'
    });
    console.log(`Transcription: ${audioResponse.text}\n`);

    // 4. Embeddings
    console.log('4. Embeddings:');
    const embedResponse = await openmodels.run({
      task: 'embedding',
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      input: 'Hello world'
    });
    console.log(`Embedding dimension: ${embedResponse.data[0].embedding.length}\n`);

    console.log('=== Demo Complete ===');

  } catch (error) {
    console.error('Error:', error);
  }
}

multiTaskDemo();
