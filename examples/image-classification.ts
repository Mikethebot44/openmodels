import { client } from '../src';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function imageClassification() {
  const apiKey = process.env.OPENMODELS_API_KEY;

  const openmodels = client({
    apiKey: apiKey,
  });

  try {
    // Using the new run() API
    const response = await openmodels.run({
      task: 'image-classification',
      model: 'google/vit-base-patch16-224',
      input: 'https://example.com/cat.jpg', // Replace with actual image URL
      top_k: 5
    });

    console.log('Classification Response:');
    console.log(`ID: ${response.id}`);
    console.log('Classifications:');
    response.classifications.forEach((classification, index) => {
      console.log(`  ${index + 1}. ${classification.label} (${(classification.score * 100).toFixed(2)}%)`);
    });
    if (response.cost_breakdown) {
      console.log('Cost:', response.cost_breakdown);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

imageClassification();
