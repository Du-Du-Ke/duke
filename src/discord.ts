import type { Interaction, Collection } from 'discord.js'

type handler = (interaction: Interaction) => Promise<void>

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, handler>;
  }
}
