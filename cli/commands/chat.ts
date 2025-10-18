import { Command } from 'commander';
import { client } from '../../src';
import chalk from 'chalk';
import ora from 'ora';
import { readConfig } from '../utils';

export const chatCommand = new Command('chat')
  .description('Chat with AI models')
  .argument('[message]', 'Message to send to the AI')
  .option('-m, --model <model>', 'Model to use', 'microsoft/DialoGPT-medium')
  .option('-s, --stream', 'Stream the response', false)
  .option('-t, --temperature <temp>', 'Temperature for generation', '0.7')
  .option('-k, --max-tokens <tokens>', 'Maximum tokens to generate', '200')
  .option('-i, --interactive', 'Interactive chat mode', false)
  .action(async (message, options) => {
    const config = readConfig();
    const openmodels = client(config);

    if (options.interactive) {
      await interactiveChat(openmodels, options);
    } else if (message) {
      await singleChat(openmodels, message, options);
    } else {
      console.log(chalk.red('Error: Please provide a message or use --interactive mode'));
      process.exit(1);
    }
  });

async function singleChat(openmodels: any, message: string, options: any) {
  const spinner = ora('Generating response...').start();
  
  try {
    const request = {
      model: options.model,
      messages: [
        { role: 'user', content: message }
      ],
      max_tokens: parseInt(options.maxTokens),
      temperature: parseFloat(options.temperature),
      stream: options.stream
    };

    if (options.stream) {
      spinner.stop();
      const stream = await openmodels.chat(request) as AsyncGenerator<string, void, unknown>;
      
      process.stdout.write(chalk.blue('Response: '));
      for await (const token of stream) {
        process.stdout.write(token);
      }
      console.log();
    } else {
      const response = await openmodels.chat(request);
      spinner.stop();
      
      console.log(chalk.blue('Response:'));
      console.log(response.choices[0].message.content);
    }
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

async function interactiveChat(openmodels: any, options: any) {
  console.log(chalk.green('Interactive chat mode. Type "exit" to quit.'));
  console.log(chalk.gray(`Using model: ${options.model}`));
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question(chalk.blue('You: '), async (input: string) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      const spinner = ora('Generating response...').start();
      
      try {
        const request = {
          model: options.model,
          messages: [
            { role: 'user', content: input }
          ],
          max_tokens: parseInt(options.maxTokens),
          temperature: parseFloat(options.temperature),
          stream: false
        };

        const response = await openmodels.chat(request);
        spinner.stop();
        
        console.log(chalk.green('AI:'), response.choices[0].message.content);
        console.log();
        askQuestion();
      } catch (error) {
        spinner.stop();
        console.error(chalk.red('Error:'), error);
        askQuestion();
      }
    });
  };

  askQuestion();
}
