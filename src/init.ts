import 'dotenv/config';

const RequiredEnvVariables = [
  {
    name: 'BOT_TOKEN',
    value: process.env.BOT_TOKEN
  },
  {
    name: 'APPLICATION_ID',
    value: process.env.APPLICATION_ID
  }
] as const

/**
 * This is a utility method that checks that everything the bot needs to start is available.
 * THis includes but isn't limited to the following:
 * 1. Check for presence of required environment variables.
 * 2. Confirm connection to required external services (e.g database)
 */
export const init = () => {
  console.log(RequiredEnvVariables, '<===')
  for (let idx = 0; idx < RequiredEnvVariables.length; idx++) {
    const { value, name } = RequiredEnvVariables[idx]
    // We check if `value` is defined because even though it's type is a string
    // it's possible it's undefined because of the magic we did in `env.ts`.
    if (!value || value === '') {
      console.error(`cannot start duke: missing environment variable "${name}"`);
      forceExit();
    }
  }
};

const forceExit = () => process.exit(1);
