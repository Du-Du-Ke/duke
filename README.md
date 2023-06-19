# Duke 

## Overview

This bot is designed to manage the Du-Du-Ke's Discord server. It currently supports the following slash commands:

- `/ping` - Checks if the bot is online. The bot will respond with "PONG".
- `/share` - Shares music or video to Du-Du-Ke's social media channels.
- `/website` - Manage DuDuKe's website (this command requires admin privilege on Discord).

## Setup

If you'd like to contribute, please follow these steps to get the bot running on your local machine:

### Prerequisites

You'll need to have the following installed:

- `pnpm`
- `node` version 18 or higher

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Du-Du-Ke/duke
   ```

2. Duplicate `.env.example`, rename it to `.env`, and fill in the necessary information.

3. Install dependencies and start the bot:

   ```bash
   pnpm install
   pnpm run dev
   ```

The bot should now be up and running!

## Adding a Slash Command

To add a new slash command:

1. Create a new file in the `src/commands` directory. The file should be named `<command_name>.command.ts`.

2. The file must export two variables:
   
    - `slashCommand`: This should be of type `SlashCommandBuilder`, which is a type from discord.js used to build slash commands.
    
    - `handler`: This should be an asynchronous function that handles the slash command.

3. Once the command file is created, you need to deploy it to Discord by running:

    ```bash
    pnpm deployCommands
    ```

You will need to run `pnpm deployCommands` every time you make an update to the slash command. However, you do not need to do this if you're only updating the command's handler function.

Happy Coding!

A GitHub PAT is needed for the `/website update_playlist_link` command, the PAT should be given the `public_repo` and `pull_request` scope.
