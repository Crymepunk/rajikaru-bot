const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { randomColor } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription("Replies with the user's avatar")
        .addUserOption(option => option.setName('member').setDescription('Select a user')),
	async execute(interaction) {
		let user = interaction.options.getUser('member');
		if (!user) {
			user = interaction.user;
		}
		const aviemb = new MessageEmbed()
			.setTitle(`${user.username}'s avatar`)
			.setColor(`${randomColor()}`)
			.setImage(`${user.avatarURL()}?size=1024`);
        await interaction.reply({ embeds: [aviemb] });
	},
};
