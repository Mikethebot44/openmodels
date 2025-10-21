import { client } from '../src';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function visionModelsComparison() {
  const apiKey = process.env.OPENMODELS_API_KEY;

  const openmodels = client({
    baseUrl: 'https://tryscout.dev', // Your Next.js app URL
    apiKey: apiKey,
  });

  const imageUrl = 'https://example.com/cat.jpg'; // Replace with actual image
  const models = [
    'google/vit-base-patch16-224',
    'facebook/convnext-base-224',
    'openai/clip-vit-base-patch32'
  ];

  try {
    console.log('=== Vision Models Comparison ===\n');
    console.log(`Image: ${imageUrl}\n`);

    for (const model of models) {
      console.log(`Model: ${model}`);
      
      const response = await openmodels.run({
        task: 'image-classification',
        model: model,
        input: imageUrl,
        top_k: 3
      });

      console.log('Top 3 classifications:');
      response.classifications.forEach((classification, index) => {
        console.log(`  ${index + 1}. ${classification.label} (${(classification.score * 100).toFixed(2)}%)`);
      });
      
      if (response.cost_breakdown) {
        console.log(`Cost: $${response.cost_breakdown.total_cost.toFixed(4)}`);
      }
      
      console.log('---\n');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

visionModelsComparison();
