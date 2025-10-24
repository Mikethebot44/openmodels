import { client } from '../src';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function multiImage() {
  const openmodels = client({
    apiKey: process.env.OPENMODELS_API_KEY,
  });

  const prompts = [
    'A futuristic city skyline at night with neon lights',
    'A serene forest with sunlight filtering through trees',
    'An abstract painting with vibrant colors and geometric shapes',
    'A vintage car parked in front of a classic diner'
  ];

  try {
    console.log('Generating multiple images...');
    
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      console.log(`\nGenerating image ${i + 1}/4: "${prompt}"`);
      
      const response = await openmodels.image({
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        prompt: prompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1
      });

      // Save each image
      if (response.data[0].b64_json) {
        const imageBuffer = Buffer.from(response.data[0].b64_json, 'base64');
        const filename = `multi_image_${i + 1}_${Date.now()}.png`;
        const filepath = path.join(__dirname, filename);
        
        fs.writeFileSync(filepath, imageBuffer);
        console.log(`✓ Image ${i + 1} saved to: ${filepath}`);
      }
    }
    
    console.log('\nAll images generated successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

multiImage();
