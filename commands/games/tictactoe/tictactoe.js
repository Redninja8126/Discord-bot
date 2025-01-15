const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateButtons, generateEmbed, checkWinner } = require('../../utils/tictactoeUtils'); // Ensure correct relative path

let games = {}; // Store active Tic-Tac-Toe games

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Start a game of Tic-Tac-Toe.')
        .addUserOption(option =>
            option
                .setName('opponent')
                .setDescription('Select a user to play against.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');
        if (opponent.id === interaction.user.id) {
            return interaction.reply('You can’t play against yourself!');
        }

        const board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
        const channelId = interaction.channel.id;

        games[channelId] = { players: [interaction.user, opponent], board, turn: 0 };

        const embed = generateEmbed(board, [interaction.user, opponent], `${interaction.user}'s turn!`);
        const buttons = generateButtons(board, channelId);

        await interaction.reply({ embeds: [embed], components: buttons });
    },
    async handleInteraction(interaction) {
        const [action, channelId, position] = interaction.customId.split('-');
        if (action !== 'move') return;

        const game = games[channelId];
        if (!game) {
            return interaction.reply({ content: 'No active game in this channel!', ephemeral: true });
        }

        const player = game.players[game.turn % 2];
        if (interaction.user.id !== player.id) {
            return interaction.reply({ content: "It's not your turn!", ephemeral: true });
        }

        const pos = parseInt(position);
        if (game.board[pos] !== ' ') {
            return interaction.reply({ content: 'That spot is already taken!', ephemeral: true });
        }

        // Update the board
        game.board[pos] = game.turn % 2 === 0 ? 'X' : 'O';
        game.turn++;

        const winner = checkWinner(game.board);
        const currentPlayer = game.players[game.turn % 2];

        if (winner) {
            await interaction.update({
                embeds: [generateEmbed(game.board, game.players, `${winner} wins!`)],
                components: [],
            });
            delete games[channelId];
        } else if (game.turn === 9) {
            await interaction.update({
                embeds: [generateEmbed(game.board, game.players, "It's a tie!")],
                components: [],
            });
            delete games[channelId];
        } else {
            await interaction.update({
                embeds: [generateEmbed(game.board, game.players, `${currentPlayer}'s turn!`)],
                components: generateButtons(game.board, channelId),
            });
        }
    },
};
