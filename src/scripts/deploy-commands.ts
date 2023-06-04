import '../env';
import { init } from '../init'

import { REST, Routes, SlashCommandBuilder, Interaction, ApplicationCommandOptionType } from 'discord.js';
import fs from 'fs';
import path from 'path';

interface Command {
  name: string;
  description: string;
  options: CommandOptions[];
}

interface CommandOptions {
  name: string;
  description: string;
  type: ApplicationCommandOptionType
}

// and deploy your commands!
(async () => {
  try {
    init();

    const commands: Command[] = [];

    // set commands for clients
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.command.js') || file.endsWith('.command.ts'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const { slashCommand } = require(filePath) as { slashCommand: SlashCommandBuilder, handler: (interaction: Interaction) => Promise<void> };

      const commandOptions: CommandOptions[] = slashCommand.options.map(option => {
        const opt = option.toJSON();
        return opt;
      });

      commands.push({
        name: slashCommand.name,
        description: slashCommand.description,
        options: commandOptions
      });
    }

    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(process.env.BOT_TOKEN);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.APPLICATION_ID),
      { body: commands },
    );

    console.log(`Successfully reloaded ${(data as Array<unknown>).length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
