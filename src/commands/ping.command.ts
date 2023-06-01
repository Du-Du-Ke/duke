import { ApplicationCommand, SlashCommandBuilder } from 'discord.js';

import type { Command } from '../interface';

export const command: Command = {
  deets: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong if Duke is online.')
};
