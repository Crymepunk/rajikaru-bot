const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getRandomIntInclusive, randomColor } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gayrate')
		.setDescription("How gay is the pinged person O_o")
        .addUserOption(option => option.setName('member').setDescription('Select a user')),
	async execute(interaction) {
		// Assign variables
		const user = interaction.options.getMember('member');
		// Construct embed
        let gayemb = new MessageEmbed()
            .setAuthor({ name: `Gayness Percentage` })
            .setColor(`${randomColor()}`);
		// Check if user is sender or not and get a random integer with getRandomIntInclusive from ../functions.js
		if (user && user != interaction.user) {
            gayemb = gayemb.setDescription(`${user.displayName} is ${getRandomIntInclusive(0, 101)}% gay`);
		} else {
            gayemb = gayemb.setDescription(`You are ${getRandomIntInclusive(0, 101)}% gay`);
		}
		// Reply with embed
        await interaction.reply({ embeds: [gayemb] });
	},
};
