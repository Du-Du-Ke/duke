import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from 'discord.js';

import { isValidURL, isYoutubeVideo } from '../utils/url.util';
import { ShareKind, handleShareLink } from '../utils/share.util';

export const slashCommand = new SlashCommandBuilder()
  .setName('share')
  .setDescription('share song or video to duduke\'s socials')
  .addStringOption(option => option
    .setName('link')
    .setDescription('the URL to be shared to social media')
    .setRequired(true)
  )
  .addStringOption(option => option
    .setName('message')
    .setDescription('the message to share on social media')
    .setMaxLength(150)
    .setRequired(false)
  );

export const handler = async (interaction: ChatInputCommandInteraction): Promise<Message<boolean>> => {
  await interaction.deferReply({ ephemeral: false });
  const { user, options } = interaction;

  const link = options.getString('link');
  const message = options.getString('message');

  if (!link) {
    return interaction.editReply('a link is required for this command. Please provide these options');
  }

  if (!isValidURL(link)) {
    return interaction.editReply('the link provided isn\'t a valid URL');
  }

  let kind = ShareKind.MUSIC
  if (isYoutubeVideo(link)) {
    kind = ShareKind.VIDEO
  }

  const sharedUrl = await handleShareLink(link, message || '', kind);

  // since we are not storing logs in a database, we can just use this logs to stdout as a way to track who sent what
  // in the event of a bad actor.
  console.log(`${user.username}#${user.discriminator} shared URL: "${link}" with message "${message}"`);
  const shareType = kind === ShareKind.MUSIC ? 'new gem' : 'music video';
  return interaction.editReply(`<@${user.id}> shared a [${shareType}](${sharedUrl}) with the community`);
};
