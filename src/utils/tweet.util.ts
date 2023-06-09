import ZapClient from './zap.util';

interface TweetZapEvent {
  type: string;
  tweet: string;
}

export const sendToTwitter = async (tweet: string): Promise<void> => {
  const zap = new ZapClient();
  return zap.sendWebhook<TweetZapEvent>({
    type: 'TWITTER_SHARE_EVENT',
    tweet
  });
}
