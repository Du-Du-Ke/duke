import path from 'path';
import fs from 'fs';

import { SlashCommandBuilder, Client, GatewayIntentBits, Events, Collection, Interaction } from 'discord.js';

import { handleInteractionCreate, handleClientReady } from './handlers';

export const initializeClient = (): Client => {
  // create new client
  const client: Client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages],
    failIfNotExists: true,
  });

  // subscribe to client events
  client.on(Events.ClientReady, handleClientReady);
  client.on(Events.InteractionCreate, handleInteractionCreate);

  // create a collection of commands for discord
  client.commands = new Collection();

  // set commands for clients
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.command.js') || file.endsWith('.command.ts'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { slashCommand, handler } = require(filePath) as { slashCommand: SlashCommandBuilder, handler: (interaction: Interaction) => Promise<void> };

    console.log(`initializing handler for "${slashCommand.name}" command`)
    client.commands.set(slashCommand.name, handler)
  }

  return client;
}
