import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const slashCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('get a PONG!');

export const handler = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  await interaction.reply({ ephemeral: true, content: 'PONG!' });
};
