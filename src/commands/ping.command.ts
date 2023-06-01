import { ApplicationCommand, CacheType, ChatInputCommandInteraction, Interaction, SlashCommandBuilder } from 'discord.js';

export const slashCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with pong if Duke is online.');

export const handler = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  await interaction.reply('PONG!');
};
