import { ModalSubmitInteraction } from 'discord.js';

import { ModalIDs } from '../constants';
import GitClient from '../utils/git.util';
import { generateSpotifyEmbedLink, generateAppleMusicEmbedLink } from '../utils/url.util'

export const handleModals = async (interaction: ModalSubmitInteraction) => {
  const gitClient = new GitClient(
    'Du-Du-Ke',
    'website',
    'main'
  );
  switch (interaction.customId as ModalIDs) {
    case ModalIDs.UPDATE_PLAYLIST_LINK:
      await handlePlaylistLinkUpdate(interaction, gitClient);
      break;
    default:
      await interaction.reply('invalid modal received. Contact @Moderators to fix.');
  }
}

const handlePlaylistLinkUpdate = async (interaction: ModalSubmitInteraction, gitClient: GitClient) => {
  await interaction.deferReply({ ephemeral: false });

  const spotifyPlaylistLink = interaction.fields.getTextInputValue('spotifyPlaylistLink');
  const applePlaylistLink = interaction.fields.getTextInputValue('applePlaylistLink');
  const playlistTitle = interaction.fields.getTextInputValue('playlistTitle');

  for (let link of [spotifyPlaylistLink, applePlaylistLink]) {
    try {
      new URL(link);
    } catch {
      // if we get in here it means the link isn't a valid URL
      const errMsg = `The link ${link} isn't a valid URL. Please try again.`
      console.error(errMsg);
      await interaction.reply(errMsg);
      return;
    }
  }

  const branchName = playlistTitle
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^a-zA-Z0-9]+/g, '')
    // we dont want the branch name to be more than 40 characters
    .slice(0, 40);

  await gitClient.createBranch(branchName);

  const htmlString = await gitClient.getFileContents('index.html');
  const startTag = '// --- start duke link change ---';
  const endTag = '// -- end duke link change ---';

  // Find the start and end positions of the content to be updated
  const startIndex = htmlString.indexOf(startTag) + startTag.length;
  const endIndex = htmlString.indexOf(endTag);

  // Extract the content to be updated
  const contentToUpdate = htmlString.substring(startIndex, endIndex);

  const appleEmbedLink = generateAppleMusicEmbedLink(applePlaylistLink);
  const spotifyEmbedLink = generateSpotifyEmbedLink(spotifyPlaylistLink);

  // Update the desired content
  const updatedContent = contentToUpdate
    .replace(/const appleEmbedLink = '.*?';/, `const appleEmbedLink = '${appleEmbedLink}';`)
    .replace(/const applePlaylistLink = '.*?';/, `const applePlaylistLink = '${applePlaylistLink}';`)
    .replace(/const spotifyEmbedLink = '.*?';/, `const spotifyEmbedLink = '${spotifyEmbedLink}';`)
    .replace(/const spotifyPlaylistLink = '.*?';/, `const spotifyPlaylistLink = '${spotifyPlaylistLink}';`);

  // Replace the old content with the updated content in the HTML string
  const updatedHTML = htmlString.substring(0, startIndex) + updatedContent + htmlString.substring(endIndex);

  const commitInfo = await gitClient.createCommit('index.html', updatedHTML, `update website playlist - ${playlistTitle}`);
  await gitClient.updateBranchRef(commitInfo.sha, branchName);

  const prURL = await gitClient.createPR(`Playlist Update - ${playlistTitle}`, branchName)

  await interaction.editReply(`Change submitted to GitHub. You can review the changes [here](${prURL})`);
}
