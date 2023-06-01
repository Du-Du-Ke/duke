import { Message } from 'discord.js'

export const handleMessages = async (message: Message<boolean>): Promise<void> => {

  // await message.reply('I worked');
  // We want to ignore all messages from bots for now.
  // await message.react('✅');
  // const channel = message.channel();
  console.log('==>> handled', message.inGuild())
};
