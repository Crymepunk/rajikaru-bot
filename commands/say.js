const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { contentcheck } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Says the message you tell it to say.')
        .addStringOption(option => option.setName('message').setDescription('Message to say').setRequired(true)),
	async execute(interaction) {
        const message = interaction.options.getString('message');

		if (contentcheck(message)) {
			await interaction.reply({ content: 'This contains a bad word.', ephemeral: true });
		} else if (interaction.guild == null) {
			await interaction.reply(message);
		} else if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
			await interaction.reply(message);
		} else {
			await interaction.reply({ content: 'You are missing the **Manage Server** permission.\n (Needed to prevent spam and stop bad word usage, etc.)', ephemeral: true });
		}
	},
};
