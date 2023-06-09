import fetch from 'node-fetch';

class ZapClient {
  public webhookUrl: string;
  public webhookSecret: string;

  constructor() {
    this.webhookUrl = process.env.ZAPIER_WEBHOOK_URL;
    this.webhookSecret = process.env.ZAPIER_WEBHOOK_SECRET;
  }

  sendWebhook<T extends object>(payload: T): void {
    /**
     * We make sending webhook requests a fire and forget operation
     * so we don't really care about what is returned and don't necessarily
     * wait for this request to get completed.
     */
    fetch(this.webhookUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-DUKE-WEBHOOK-SECRET': this.webhookSecret
      }
    })
    return;
  }
};

export default ZapClient;
