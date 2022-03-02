const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getRandomIntInclusive } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Replies with Heads or Tails.'),
        // Builds the slash command
	async execute(interaction) {
        const outcome = getRandomIntInclusive(0, 1);
        // Gets a number between 0 and 1
        // TODO: Make this embed wider
        let cfemb = new MessageEmbed()
            .setAuthor({ name: 'coinflip' })
            .setColor('#f57ae0');
        if (outcome == 1) {
            cfemb = cfemb.setDescription('Heads!');
            // If number is 1, then it's Heads
        } else {
            cfemb = cfemb.setDescription('Tails!');
            // If number isn't 1 (0) then it's Tails
        }
        await interaction.reply({ embeds: [cfemb] });
	},
};
