import { Message } from 'discord.js'

export const handleMessages = async (message: Message<boolean>): Promise<void> => {
  await message.react('✅');
};
