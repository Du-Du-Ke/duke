import { Interaction, CacheType, InteractionType } from 'discord.js';

import { handleChatInputCommand } from './chat.handler';
import { handleModals } from './modal.handler';

export const handleInteractionCreate = async (interaction: Interaction<CacheType>): Promise<void> => {
  if (interaction.isChatInputCommand()) {
    return handleChatInputCommand(interaction);
  }

  if (interaction.isModalSubmit()) {
    return handleModals(interaction);
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    // We use this to handle the cancel button in the modal when it's clicked.
    // We should probably find a better way to handle this but this works for now.
    return;
  }

  console.log('cannot handle interaction', interaction.type);
  return;
};
