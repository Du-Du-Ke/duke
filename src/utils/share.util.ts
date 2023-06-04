import AnnieClient, { TrackDeets } from './annie.util';
import { sendToTwitter } from './tweet.util';

/**
 * Enum for representing different types of shares in the application.
 *
 * @enum {number}
 *
 * @property {number} VIDEO - Represents sharing of a video content. Its value is "video".
 * @property {number} MUSIC - Represents sharing of a music content. Its value is "music".
 *
 * Note: The fields of this enum are used to indicate the type of share a certain action or function is dealing with, for example,
 * to differentiate between sharing a video and sharing a music. As such, if more share types are added in the future, they should
 * be added to this enum.
 */
export enum ShareKind {
  VIDEO = 'video',
  MUSIC = 'music'
}

export const handleShareLink = async (link: string, message: string, kind: ShareKind): Promise<void> => {
  switch (kind) {
    case ShareKind.MUSIC:
      return handleMusicShare(link, message);
    case ShareKind.VIDEO:
      return handleVideoShare(link, message);
    default:
      throw new Error('unknown share kind');
  }
};

const handleVideoShare = async (link: string, message: string): Promise<void> => {
  // Construct tweet
  const tweet = `Now watching:
${message}

${link}`;

  return sendToTwitter(tweet)
};

type ShareDeets = {
  isAnnie: false;
  url: string;
  message: string;
} | {
  isAnnie: true;
  url: string;
  track: {
    artiste: string;
    title: string;
  }
}

const handleMusicShare = async (link: string, message: string): Promise<void> => {
  let constructionOpts: ShareDeets = {
    isAnnie: false,
    url: link,
    message
  };
  // check if it's a URL annie can handle

  try {
    const client = new AnnieClient();
    const trackInfo = await client.getTrackDetails(link);
    constructionOpts = {
      isAnnie: true,
      url: trackInfo.annieURL,
      track: trackInfo
    }
  } catch(error) {
    // if annie fails, we default to sharing the link as is
    console.error(error);
  }

  const tweet = constructMusicTweet(constructionOpts)
  return sendToTwitter(tweet);
};

const constructMusicTweet = (deets: ShareDeets): string => {
  // Now Listening: Hamba Juba - Lady Amar, JL SA, Cici & Murumba Pitch
  if (deets.isAnnie) {
    return `Now Listening: ${deets.track.title} - ${deets.track.artiste}

  ${deets.url}`;
  }
  return `Mow Listening: ${deets.url}

${deets.message}`;
}