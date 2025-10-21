import { client } from '../src';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function audioSummarize() {
  const apiKey = process.env.OPENMODELS_API_KEY;

  const openmodels = client({
    baseUrl: 'https://mikethebot44--tryscout-audio-create-app.modal.run', // Your Next.js app URL
    apiKey: apiKey,
  });

  try {
    // Using the new run() API
    const response = await openmodels.run({
      task: 'audio-summarize',
      model: 'facebook/bart-large-cnn',
      input: 'https://example.com/meeting.wav', // Replace with actual audio URL
      prompt: 'Summarize the key points in bullet format',
      language: 'en'
    });

    console.log('Summary Response:');
    console.log(`ID: ${response.id}`);
    console.log(`Summary: ${response.text}`);
    if (response.cost_breakdown) {
      console.log('Cost:', response.cost_breakdown);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

audioSummarize();
