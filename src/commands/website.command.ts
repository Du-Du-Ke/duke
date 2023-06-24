import {
  ModalBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';

import { WebsiteOperations, ModalIDs } from '../constants';

export const slashCommand = new SlashCommandBuilder()
  .setName('website')
  .setDescription('Manage Duduke\'s website')
  .addSubcommand(subcommand =>
    subcommand
      .setName(WebsiteOperations.UPDATE_PLAYLIST_LINK)
      .setDescription('Updates the playlist URL on Duduke.fm'))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false);

export const handler = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  const { options } = interaction;
  const subcommand = options.getSubcommand();

  switch (subcommand) {
    case WebsiteOperations.UPDATE_PLAYLIST_LINK:
      await handleUpdatePlaylistLinkSubcommand(interaction);
      break;
    default:
      // we ideally should never get here in production
      console.error(`unsupported subcommand: "${subcommand}"`);
      await interaction.editReply(`the subcommand \`${subcommand}\` is unsupported by Duke. Reach out to the moderators.`);
  }
};

const handleUpdatePlaylistLinkSubcommand =  async (interaction: ChatInputCommandInteraction): Promise<void> => {
  const modal = new ModalBuilder()
    .setCustomId(ModalIDs.UPDATE_PLAYLIST_LINK)
    .setTitle('Update playlist on Duduke.fm');

  const playlistTitleText = new TextInputBuilder()
    .setStyle(TextInputStyle.Short)
    .setCustomId('playlistTitle')
    // Should not be more than 45 characters
    .setLabel('What\'s the title of this playlist?')
    .setPlaceholder('Enter the title of the playlist ...')
    .setRequired(true);

  const applePlaylistLinkText = new TextInputBuilder()
    .setStyle(TextInputStyle.Short)
    .setCustomId('applePlaylistLink')
    // Should not be more than 45 characters
    .setLabel('What\'s the apple music link?')
    .setPlaceholder('Enter the apple music playlist link ...')
    .setRequired(true);

  const spotifyPlaylistLinkText = new TextInputBuilder()
    .setStyle(TextInputStyle.Short)
    .setCustomId('spotifyPlaylistLink')
    // Should not be more than 45 characters
    .setLabel('What\'s the spotify link?')
    .setPlaceholder('Enter the spotify playlist link ...')
    .setRequired(true);

  // A modal can't have more than 5 rows, FYI.
  const firstRow = new ActionRowBuilder<TextInputBuilder>().addComponents(playlistTitleText);
  const secondRow = new ActionRowBuilder<TextInputBuilder>().addComponents(applePlaylistLinkText);
  const thirdRow = new ActionRowBuilder<TextInputBuilder>().addComponents(spotifyPlaylistLinkText);

  modal.addComponents(firstRow, secondRow, thirdRow);
  await interaction.showModal(modal);

  await interaction.followUp({ ephemeral: true, content: '[duduke.fm](https://duduke.fm) will be updated shortly with the playlist .' });
}
