#!/usr/bin/env node

import { Command } from 'commander';
import { chatCommand } from './commands/chat';
import { embedCommand } from './commands/embed';
import { imageCommand } from './commands/image';
import { modelsCommand } from './commands/models';
import { configCommand } from './commands/config';

const program = new Command();

program
  .name('openmodels')
  .description('CLI for OpenModels - Open-source AI models SDK')
  .version('0.3.0');

// Add commands
program.addCommand(chatCommand);
program.addCommand(embedCommand);
program.addCommand(imageCommand);
program.addCommand(modelsCommand);
program.addCommand(configCommand);

program.parse();
