import http from 'http';

import { init } from './init';
import { initializeClient } from './client';


// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set the response header
  res.setHeader('Content-Type', 'text/plain');

  // Write the response body
  res.end('Hello, world!');
});

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
  server.listen(process.env.PORT, () => {
    console.log(`server listening on port ${process.env.PORT}`);
  });
})();
