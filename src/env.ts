import 'dotenv/config';
import { z } from 'zod';

const env = z.object({
  BOT_TOKEN: z.string(),
  APPLICATION_ID: z.string(),
  ANNIE_BASE_URL: z.string(),
  ZAPIER_WEBHOOK_URL: z.string(),
  ZAPIER_WEBHOOK_SECRET: z.string()
});

env.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof env> { }
  }
}
