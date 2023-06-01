import { Client } from 'discord.js';

export const handleClientReady = (client: Client<true>): void => {
  console.log(`Logged in as ${client.user.tag}`)
};
