import { client } from '../src';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

/**
 * Test script to verify the new simplified initialization
 * Users now only need to provide an API key
 * Service URLs are automatically determined based on operation type
 */

async function testNewInitialization() {
  console.log('Testing new simplified initialization...\n');

  // Initialize client with only API key
  const openmodels = client({
    apiKey: process.env.OPENMODELS_API_KEY,
  });

  console.log('✓ Client initialized successfully with only API key\n');

  // Test 1: Text generation (uses text service URL automatically)
  console.log('Test 1: Text Generation');
  try {
    const textResponse = await openmodels.chat({
      model: 'microsoft/DialoGPT-medium',
      messages: [
        { role: 'user', content: 'Say hello!' }
      ],
      max_tokens: 50,
      stream: false
    });
    console.log('✓ Text generation successful');
    console.log(`Response: ${textResponse.choices[0].message.content}\n`);
  } catch (error) {
    console.error('✗ Text generation failed:', error);
  }

  // Test 2: Embeddings (uses embed service URL automatically)
  console.log('Test 2: Text Embeddings');
  try {
    const embedResponse = await openmodels.embed({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      input: 'Test embedding',
    });
    console.log('✓ Embedding generation successful');
    console.log(`Embedding dimensions: ${embedResponse.data[0].embedding.length}\n`);
  } catch (error) {
    console.error('✗ Embedding generation failed:', error);
  }

  // Test 3: Image generation (uses image service URL automatically)
  console.log('Test 3: Image Generation');
  try {
    const imageResponse = await openmodels.image({
      model: 'runwayml/stable-diffusion-v1-5',
      prompt: 'A simple test image',
      size: '512x512',
      n: 1
    });
    console.log('✓ Image generation successful');
    console.log(`Generated ${imageResponse.data.length} image(s)\n`);
  } catch (error) {
    console.error('✗ Image generation failed:', error);
  }

  console.log('\nAll tests completed!');
  console.log('Service URLs are automatically selected based on operation type.');
  console.log('Users no longer need to know or provide Modal URLs.');
}

testNewInitialization();

