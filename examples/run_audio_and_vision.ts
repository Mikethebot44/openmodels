import { client } from '../src';

async function main() {
  const openmodels = client({ apiKey: process.env.OM_API_KEY || 'om_test_key', baseUrl: process.env.OM_BASE_URL || 'http://localhost:3000' });

  // Audio transcribe
  const transcribe = await openmodels.run({
    task: 'audio-transcribe',
    model: 'openai/whisper-base',
    input: 'path_or_url_to_audio.wav'
  } as any);
  console.log('Transcription:', transcribe);

  // Audio summarize
  const summarize = await openmodels.run({
    task: 'audio-summarize',
    model: 'facebook/bart-large-cnn',
    input: 'path_or_url_to_audio.wav',
    prompt: 'Summarize in 3 bullet points'
  } as any);
  console.log('Summary:', summarize);

  // Image classification
  const classify = await openmodels.run({
    task: 'image-classification',
    model: 'google/vit-base-patch16-224',
    input: 'https://example.com/cat.jpg',
    top_k: 5
  } as any);
  console.log('Classification:', classify);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


