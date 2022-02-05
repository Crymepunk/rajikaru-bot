const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRandomIntInclusive } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Replies with Heads or Tails.'),
	async execute(interaction) {
        const outcome = getRandomIntInclusive(0, 1);
        if (outcome == 1) {
            await interaction.reply('Heads!');
        } else {
            await interaction.reply('Tails!');
        }
	},
};
