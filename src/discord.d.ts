import type { Client as DiscordClient, ApplicationCommand, Collection } from 'discord.js'

declare module 'discord.js' {
  export interface Client extends DiscordClient {
    commands: Collection<string, ApplicationCommand>
  }
}
