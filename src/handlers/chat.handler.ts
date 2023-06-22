import { ChatInputCommandInteraction } from 'discord.js';

export const handleChatInputCommand = async (interaction: ChatInputCommandInteraction) => {
  const handler = interaction.client.commands.get(interaction.commandName);
  if (!handler) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    await interaction.reply(`the slash command \`${interaction.commandName}\` is not supported.`)
    return;
  }

  try {
    await handler(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
}
