import AnnieClient, { TrackDeets } from './annie.util';
import { sendToTwitter } from './tweet.util';
import { MAX_TWITTER_CHAR_LENGTH } from '../constants';

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

export const handleShareLink = async (link: string, message: string, kind: ShareKind): Promise<string> => {
  switch (kind) {
    case ShareKind.MUSIC:
      return handleMusicShare(link, message);
    case ShareKind.VIDEO:
      return handleVideoShare(link, message);
    default:
      throw new Error('unknown share kind');
  }
};

const handleVideoShare = async (link: string, message: string): Promise<string> => {
  // Construct tweet
  const tweet = `Now watching:
${message}

${link}`;

  await sendToTwitter(tweet);
  return link;
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
  message: string;
}

const handleMusicShare = async (link: string, message: string): Promise<string> => {
  let constructionOpts: ShareDeets = {
    isAnnie: false,
    url: link,
    message
  };

  const client = new AnnieClient();

  if (client.canConvert(link)) {
    try {
      const trackInfo = await client.getTrackDetails(link);
      constructionOpts = {
        isAnnie: true,
        url: trackInfo.annieURL,
        track: trackInfo,
        message
      }
    } catch (error) {
      // if annie fails, we default to sharing the link as is
      console.error('error getting annie details for track', error);
    }
  }

  const tweet = constructMusicTweet(constructionOpts)
  await sendToTwitter(tweet);
  return constructionOpts.url;
};

const constructMusicTweet = (deets: ShareDeets): string => {
  let tweet: string;

  if (deets.message !== '') {
    tweet = deets.message;
  } else if (deets.isAnnie) {
    tweet = `Now Listening: ${deets.track.title} - ${deets.track.artiste}`
  } else {
    tweet = `Now Listening: `
  }

  const tweetWithURL = `${tweet}
${deets.url}`
  // If the tweet including the original message added by the sharer is greater than the max
  // length of a tweet, we remove the message and share without the message
  if (tweetWithURL.length > MAX_TWITTER_CHAR_LENGTH) {
    return `Now Listening:
${deets.url}`
  }
  return tweetWithURL
}
