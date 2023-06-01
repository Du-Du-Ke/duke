import path from 'path';
import fs from 'fs';

import { REST, Routes, Client, GatewayIntentBits, Events, Collection } from 'discord.js';

import { handleMessages, handleInteractionCreate, handleClientReady } from './handlers';

import type { Command } from './interface';

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong! This is used to check if Duke is online',
  },
];

export const registerSlashCommand = async () => {
  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

  console.log('Started refreshing application (/) commands.');
  await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: commands });
  console.log('Successfully reloaded application (/) commands.');
};

export const initializeClient = (): Client => {
  // create new client
  const client: Client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages],
    failIfNotExists: true,
  });

  // subscribe to client events
  client.on(Events.ClientReady, handleClientReady);
  client.on(Events.InteractionCreate, handleInteractionCreate);
  client.on(Events.MessageCreate, handleMessages);

  // create a collection of commands for discord
  client.commands = new Collection();

  // set commands for clients
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.command.js'));
  console.log(commandFiles)

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { command } = require(filePath);

    console.log(command, '<===')
    // console.log(command.deets.name, '<====')
  }

  return client;
}
