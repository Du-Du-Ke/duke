import { z } from 'zod';

const env = z.object({
    DISCORD_BOT_TOKEN: z.string(),
    PORT: z.string()
});

env.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof env> {}
    }
}
