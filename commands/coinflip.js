const { SlashCommandBuilder } = require('@discordjs/builders');

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

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
