import { Interaction, CacheType } from 'discord.js';

export const handleInteractionCreate = async (interaction: Interaction<CacheType>): Promise<void> => {
  if (!interaction.isChatInputCommand()) return;

	const handler = interaction.client.commands.get(interaction.commandName);
  if (!handler) {
		console.error(`No command matching ${interaction.commandName} was found.`);
    await interaction.reply(`the slash command "${interaction.commandName}" is not supported.`)
		return;
	}

  await handler();
};
