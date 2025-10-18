import { client } from '../src';
import * as fs from 'fs';
import * as path from 'path';

async function textToImage() {
  const openmodels = client({
    baseUrl: 'https://mikethebot44--openmodels-image-inference-create-app.modal.run',
  });

  try {
    const response = await openmodels.image({
      model: 'runwayml/stable-diffusion-v1-5',
      prompt: 'A beautiful sunset over a mountain landscape with a lake in the foreground, digital art style',
      size: '512x512',
      quality: 'standard',
      n: 1
    });

    console.log('Image generation response:');
    console.log(`Created: ${response.created}`);
    console.log(`Number of images: ${response.data.length}`);
    
    // Save the first image
    if (response.data[0].b64_json) {
      const imageBuffer = Buffer.from(response.data[0].b64_json, 'base64');
      const filename = `generated_image_${Date.now()}.png`;
      const filepath = path.join(__dirname, filename);
      
      fs.writeFileSync(filepath, imageBuffer);
      console.log(`Image saved to: ${filepath}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

textToImage();
