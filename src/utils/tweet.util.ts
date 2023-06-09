import ZapClient from './zap.util';

export const sendToTwitter = async (tweet: string): Promise<void> => {
  const zap = new ZapClient();
  return zap.sendWebhook(tweet);
}
