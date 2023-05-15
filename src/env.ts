import { z } from 'zod';

const env = z.object({
    BOT_TOKEN: z.string(),
    PORT: z.string(),
    CLIENT_ID: z.string(),
});

env.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof env> {}
    }
}