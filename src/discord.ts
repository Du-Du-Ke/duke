import type { Client as DiscordClient, ApplicationCommand, Collection } from 'discord.js'

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, () => void | Promise<void>>;
  }
}
