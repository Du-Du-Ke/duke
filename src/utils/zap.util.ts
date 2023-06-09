import fetch from 'node-fetch';

class ZapClient {
  public webhookUrl: string;
  public webhookSecret: string;

  constructor() {
    this.webhookUrl = process.env.ZAPIER_WEBHOOK_URL;
    this.webhookSecret = process.env.ZAPIER_WEBHOOK_SECRET;
  }

  // We can comfortably send payload as a string here because we only use this webhook
  // for sending out tweets. If and when this changes, we should revisit checking the type
  // of `payload` before passing it into `fetch`.
  // Most especially if `payload` is an object, one would have to `JSON.stringify` it.
  sendWebhook(payload: string): void {
    /**
     * We make sending webhook requests a fire and forget operation
     * so we don't really care about what is returned and don't necessarily
     * wait for this request to get completed.
     */
    fetch(this.webhookUrl, {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        'X-DUKE-WEBHOOK-SECRET': this.webhookSecret
      }
    })
    return;
  }
};

export default ZapClient;
