import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const slashCommand = new SlashCommandBuilder()
  .setName('share')
  .setDescription('Share a song or video to Duduke\'s socials');

export const handler = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  await interaction.reply('Shared!');
};
