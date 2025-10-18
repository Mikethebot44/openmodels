import { Command } from 'commander';
import { client } from '../../src';
import chalk from 'chalk';
import ora from 'ora';
import { readConfig } from '../utils';

export const embedCommand = new Command('embed')
  .description('Generate text embeddings')
  .argument('<text>', 'Text to embed')
  .option('-m, --model <model>', 'Embedding model to use', 'sentence-transformers/all-MiniLM-L6-v2')
  .option('-f, --format <format>', 'Output format (json, values)', 'json')
  .option('-u, --url <url>', 'Custom embedding backend URL')
  .action(async (text, options) => {
    const config = readConfig();
    
    // Use custom URL if provided, otherwise try to get embedding URL from config
    const baseUrl = options.url || config.embedUrl || config.baseUrl;
    
    const openmodels = client({ baseUrl });

    const spinner = ora('Generating embedding...').start();
    
    try {
      const response = await openmodels.embed({
        model: options.model,
        input: text,
      });

      spinner.stop();

      if (options.format === 'values') {
        console.log(chalk.blue('Embedding values:'));
        console.log(response.data[0].embedding.slice(0, 10).map((v: number) => v.toFixed(4)).join(', '));
        console.log(chalk.gray(`... (${response.data[0].embedding.length} dimensions)`));
      } else {
        console.log(chalk.blue('Embedding response:'));
        console.log(JSON.stringify(response, null, 2));
      }
    } catch (error) {
      spinner.stop();
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });
