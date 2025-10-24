import { client } from '../src';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function audioTranscribe() {
  const apiKey = process.env.OPENMODELS_API_KEY;

  const openmodels = client({
    apiKey: apiKey,
  });

  try {
    // Using a working audio URL - this is a short sample from Archive.org
    const response = await openmodels.run({
      task: 'audio-transcribe',
      model: 'openai/whisper-base',
      input: 'https://archive.org/download/testmp3testfile/mpthreetest.mp3',
      language: 'en',
      prompt: 'Transcribe this audio accurately'
    });

    console.log('Transcription Response:');
    console.log(`ID: ${response.id}`);
    console.log(`Text: ${response.text}`);
    console.log(`Language: ${response.language}`);
    if (response.segments) {
      console.log('Segments:', response.segments);
    }
    if (response.cost_breakdown) {
      console.log('Cost:', response.cost_breakdown);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

audioTranscribe();
