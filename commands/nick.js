const { SlashCommandBuilder } = require('@discordjs/builders');
const { Formatters, GuildMember } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nick')
		.setDescription("Give a nickname to the mentioned user.")
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('nick').setDescription('New Nickname').setRequired(true)),
	async execute(interaction) {
			const user = interaction.options.getUser('member');
            const nick = interaction.options.getString('nick');
            member.setNickname(nick);
            interaction.reply(`Changed ${user.username}'s nickname to ${user}`);
	},
};
