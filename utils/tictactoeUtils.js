const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

function generateEmbed(board, players, currentPlayer) {
    const formattedBoard = `
${board[0]} | ${board[1]} | ${board[2]}
---------
${board[3]} | ${board[4]} | ${board[5]}
---------
${board[6]} | ${board[7]} | ${board[8]}
    `;

    return new EmbedBuilder()
        .setTitle('🎮 Tic-Tac-Toe')
        .setDescription(`**Game Board:**\n\`\`\`${formattedBoard}\`\`\``)
        .setColor(0x3498db)
        .addFields(
            { name: 'Player X', value: players[0].toString(), inline: true },
            { name: 'Player O', value: players[1].toString(), inline: true },
            { name: 'Current Turn', value: currentPlayer }
        )
        .setFooter({ text: 'Use the buttons below to play your move!' });
}

function generateButtons(board, channelId) {
    const rows = [];
    for (let i = 0; i < 3; i++) {
        const row = new ActionRowBuilder();
        for (let j = 0; j < 3; j++) {
            const pos = i * 3 + j;
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`move-${channelId}-${pos}`)
                    .setLabel(board[pos] === ' ' ? ' ' : board[pos])
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(board[pos] !== ' ')
            );
        }
        rows.push(row);
    }
    return rows;
}

function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] !== ' ' && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

module.exports = { generateEmbed, generateButtons, checkWinner };
