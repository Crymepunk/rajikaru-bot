const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRandomIntInclusive } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Replies with Heads or Tails.'),
        // Builds the slash command
	async execute(interaction) {
        const outcome = getRandomIntInclusive(0, 1);
        // Gets a number between 0 and 1
        if (outcome == 1) {
            await interaction.reply('Heads!');
            // If number is 1, then it's Heads
        } else {
            await interaction.reply('Tails!');
            // If number isn't 1 (0) then it's Tails
        }
	},
};
