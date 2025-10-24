import { client } from '../src';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function audioWorkflow() {
  const apiKey = process.env.OPENMODELS_API_KEY;

  const openmodels = client({
    apiKey: apiKey,
  });

  const audioUrl = 'https://example.com/meeting.wav'; // Replace with actual audio

  try {
    console.log('=== Audio Processing Workflow ===\n');
    console.log(`Processing: ${audioUrl}\n`);

    // Step 1: Transcribe the audio
    console.log('Step 1: Transcribing audio...');
    const transcribeResponse = await openmodels.run({
      task: 'audio-transcribe',
      model: 'openai/whisper-base',
      input: audioUrl,
      language: 'en'
    });

    console.log('Transcription:');
    console.log(transcribeResponse.text);
    console.log('');

    // Step 2: Summarize the transcription
    console.log('Step 2: Summarizing transcription...');
    const summarizeResponse = await openmodels.run({
      task: 'audio-summarize',
      model: 'facebook/bart-large-cnn',
      input: audioUrl, // This will transcribe internally then summarize
      prompt: 'Create a structured summary with key points and action items'
    });

    console.log('Summary:');
    console.log(summarizeResponse.text);
    console.log('');

    // Step 3: Generate embeddings for search
    console.log('Step 3: Creating embeddings for search...');
    const embedResponse = await openmodels.run({
      task: 'embedding',
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      input: [transcribeResponse.text, summarizeResponse.text]
    });

    console.log(`Created ${embedResponse.data.length} embeddings`);
    console.log(`Embedding dimension: ${embedResponse.data[0].embedding.length}`);

    // Calculate total cost
    let totalCost = 0;
    if (transcribeResponse.cost_breakdown) totalCost += transcribeResponse.cost_breakdown.total_cost;
    if (summarizeResponse.cost_breakdown) totalCost += summarizeResponse.cost_breakdown.total_cost;
    if (embedResponse.cost_breakdown) totalCost += embedResponse.cost_breakdown.total_cost;
    
    console.log(`\nTotal workflow cost: $${totalCost.toFixed(4)}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

audioWorkflow();
