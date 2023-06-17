import { init } from './init';
import { initializeClient } from './client';

/**
 * It's very important for this to be imported here so typescript
 * can understand the `ProcessEnv` declaration in `env.ts`.
 */
import './env';
import './discord';

(async () => {
  /**
   * The init function must always be called first, because it ensures
   * everything needed to run is ready.
   */
  init();

  const client = initializeClient();
  await client.login(process.env.BOT_TOKEN);
})();
