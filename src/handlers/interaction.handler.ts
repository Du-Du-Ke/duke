import { Interaction, CacheType } from 'discord.js';

export const handleInteractionCreate = async (interaction: Interaction<CacheType>): Promise<void> => {
  if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

  // command.execute()

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
};
