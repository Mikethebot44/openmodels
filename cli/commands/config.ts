import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export const configCommand = new Command('config')
  .description('Manage OpenModels configuration')
  .command('set')
  .description('Set configuration values')
  .argument('<key>', 'Configuration key (api-key, base-url, embed-url, image-url)')
  .argument('<value>', 'Configuration value')
  .action(async (key, value) => {
    const configPath = path.join(os.homedir(), '.openmodels', 'config.json');
    const configDir = path.dirname(configPath);
    
    // Ensure config directory exists
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    // Read existing config
    let config: any = {};
    if (fs.existsSync(configPath)) {
      try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (error) {
        console.log(chalk.yellow('Warning: Could not read existing config, creating new one'));
      }
    }
    
    // Update config
    config[key] = value;
    
    // Write config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log(chalk.green(`✓ Set ${key} = ${value}`));
  });

configCommand
  .command('get')
  .description('Get configuration values')
  .argument('[key]', 'Configuration key to get (optional)')
  .action(async (key) => {
    const config = readConfig();
    
    if (key) {
      if (config[key]) {
        console.log(chalk.blue(`${key}:`), config[key]);
      } else {
        console.log(chalk.red(`Configuration key '${key}' not found`));
        process.exit(1);
      }
    } else {
      console.log(chalk.blue('Current configuration:'));
      Object.entries(config).forEach(([k, v]) => {
        console.log(`  ${chalk.cyan(k)}: ${v}`);
      });
    }
  });

configCommand
  .command('list')
  .description('List all configuration values')
  .action(async () => {
    const config = readConfig();
    
    console.log(chalk.blue('Current configuration:'));
    Object.entries(config).forEach(([k, v]) => {
      console.log(`  ${chalk.cyan(k)}: ${v}`);
    });
  });

export function readConfig(): any {
  const configPath = path.join(os.homedir(), '.openmodels', 'config.json');
  
  if (!fs.existsSync(configPath)) {
    return {
      baseUrl: 'https://modal.run/api/v1'
    };
  }
  
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.log(chalk.yellow('Warning: Could not read config file, using defaults'));
    return {
      baseUrl: 'https://modal.run/api/v1'
    };
  }
}
