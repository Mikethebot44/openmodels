import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export function readConfig(): any {
  const configPath = path.join(os.homedir(), '.openmodels', 'config.json');
  
  if (!fs.existsSync(configPath)) {
    return {
      baseUrl: 'https://modal.run/api/v1'
    };
  }
  
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Handle both 'base-url' and 'baseUrl' formats
    if (config['base-url'] && !config.baseUrl) {
      config.baseUrl = config['base-url'];
    }
    
    return config;
  } catch (error) {
    console.log('Warning: Could not read config file, using defaults');
    return {
      baseUrl: 'https://modal.run/api/v1'
    };
  }
}
