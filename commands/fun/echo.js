const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with the provided text.')
        .addStringOption(option =>
            option
                .setName('text')
                .setDescription('The text to echo.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        await interaction.reply(text);
    },
};
