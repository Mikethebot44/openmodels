import { Command } from 'commander';
import chalk from 'chalk';
import { readConfig } from '../utils';

export const modelsCommand = new Command('models')
  .description('List available models')
  .option('-t, --type <type>', 'Filter by model type (text, embed, image)', 'all')
  .action(async (options) => {
    const config = readConfig();
    
    const models = {
      text: [
        'microsoft/DialoGPT-medium',
        'microsoft/DialoGPT-large',
        'facebook/blenderbot-400M-distill',
        'EleutherAI/gpt-neo-2.7B',
        'EleutherAI/gpt-j-6B',
        'microsoft/DialoGPT-small',
        'distilgpt2'
      ],
      embed: [
        'sentence-transformers/all-MiniLM-L6-v2',
        'sentence-transformers/all-mpnet-base-v2',
        'BAAI/bge-large-en',
        'BAAI/bge-base-en',
        'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
        'sentence-transformers/all-MiniLM-L12-v2'
      ],
      image: [
        'stabilityai/stable-diffusion-xl-base-1.0',
        'runwayml/stable-diffusion-v1-5',
        'stabilityai/stable-diffusion-2-1',
        'CompVis/stable-diffusion-v1-4'
      ]
    };

    if (options.type === 'all') {
      console.log(chalk.blue('Available Models:'));
      console.log();
      
      console.log(chalk.green('Text Generation Models:'));
      models.text.forEach(model => {
        console.log(`  ${chalk.cyan('•')} ${model}`);
      });
      
      console.log();
      console.log(chalk.green('Embedding Models:'));
      models.embed.forEach(model => {
        console.log(`  ${chalk.cyan('•')} ${model}`);
      });
      
      console.log();
      console.log(chalk.green('Image Generation Models:'));
      models.image.forEach(model => {
        console.log(`  ${chalk.cyan('•')} ${model}`);
      });
    } else if (models[options.type as keyof typeof models]) {
      console.log(chalk.blue(`${options.type.charAt(0).toUpperCase() + options.type.slice(1)} Models:`));
      models[options.type as keyof typeof models].forEach(model => {
        console.log(`  ${chalk.cyan('•')} ${model}`);
      });
    } else {
      console.log(chalk.red('Error: Invalid model type. Use: text, embed, image, or all'));
      process.exit(1);
    }
  });
