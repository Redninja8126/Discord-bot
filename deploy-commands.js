const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

function getFiles(dir) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true,
    });
    let commandFiles = [];

    for (const file of files) { // Use 'file' for the loop variable
        if (file.isDirectory()) {
            commandFiles = [
                ...commandFiles,
                ...getFiles(`${dir}/${file.name}`),
            ];
        } else if (file.name.endsWith('.js')) { // Correct property access
            commandFiles.push(`${dir}/${file.name}`);
        }
    }
    return commandFiles;
}

let commands = [];
const commandFiles = getFiles('./commands');

for (const file of commandFiles) {
    const command = require(file); // Use 'file' instead of 'files'
    commands.push(command.data.toJSON()); // Correct method to push commands
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands }) // Corrected 'put' instead of 'push'
    .then(() => console.log('Successfully registered application commands!'))
    .catch(console.error);
