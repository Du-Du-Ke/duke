import { Interaction, SlashCommandBuilder } from 'discord.js';

export interface Command {
  deets: SlashCommandBuilder,
  execute: (interaction: Interaction) => void
};
