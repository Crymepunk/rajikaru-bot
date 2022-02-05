const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Says the message you tell it to say.')
        .addStringOption(option => option.setName('message').setDescription('Message to say').setRequired(true)),
	async execute(interaction) {
        const message = interaction.options.getString('message');

		if (message.includes(['nigger', 'niggër', 'niggêr', 'nigg3r', 'nïgger', 'nïggër', 'nïggêr', 'nïgg3r', 'nîgger', 'nîggër', 'nîggêr', 'nîgg3r', 'n1gger', 'n1ggër', 'n1ggêr', 'n1gg3r'])) {
			await interaction.reply({ content: 'This contains a bad word.', ephemeral: true });
		} else if (interaction.user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
			await interaction.reply(message);
		} else {
			await interaction.reply({ content: 'You are missing the **Manage Server** permission.\n (Needed to prevent spam and stop bad word usage, etc.)', ephemeral: true });
		}
	},
};
