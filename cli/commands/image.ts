import { Command } from 'commander';
import { client } from '../../src';
import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs';
import * as path from 'path';
import { readConfig } from '../utils';

export const imageCommand = new Command('image')
  .description('Generate images from text prompts')
  .argument('<prompt>', 'Text prompt for image generation')
  .option('-m, --model <model>', 'Image model to use', 'stabilityai/stable-diffusion-xl-base-1.0')
  .option('-s, --size <size>', 'Image size', '1024x1024')
  .option('-q, --quality <quality>', 'Image quality (standard, hd)', 'standard')
  .option('-n, --number <number>', 'Number of images to generate', '1')
  .option('-o, --output <file>', 'Output file path')
  .option('-u, --url <url>', 'Custom image backend URL')
  .action(async (prompt, options) => {
    const config = readConfig();
    
    // Use custom URL if provided, otherwise try to get image URL from config
    const baseUrl = options.url || config.imageUrl || config.baseUrl;
    
    const openmodels = client({ baseUrl });

    const spinner = ora('Generating image...').start();
    
    try {
      const response = await openmodels.image({
        model: options.model,
        prompt: prompt,
        size: options.size,
        quality: options.quality,
        n: parseInt(options.number)
      });

      spinner.stop();

      const imageData = response.data[0];
      if (imageData.b64_json) {
        const imageBuffer = Buffer.from(imageData.b64_json, 'base64');
        
        const filename = options.output || `generated_image_${Date.now()}.png`;
        const filepath = path.resolve(filename);
        
        fs.writeFileSync(filepath, imageBuffer);
        
        console.log(chalk.green('✓ Image generated successfully!'));
        console.log(chalk.blue('Saved to:'), filepath);
        console.log(chalk.gray(`Model: ${response.model}`));
        console.log(chalk.gray(`Size: ${options.size}`));
      }
    } catch (error) {
      spinner.stop();
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });
