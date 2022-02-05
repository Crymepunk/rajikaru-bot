const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

function contentcheck(message, filter) {
	const len = filter.length;
	for (let i = 0; i < len; i++) {
		if (message.includes(filter[i])) {
			return true;
		}
	}
	return false;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Says the message you tell it to say.')
        .addStringOption(option => option.setName('message').setDescription('Message to say').setRequired(true)),
	async execute(interaction) {
        const message = interaction.options.getString('message');
		const filter = ['nigger', 'niggër', 'niggêr', 'nigg3r', 'nïgger', 'nïggër', 'nïggêr', 'nïgg3r', 'nîgger', 'nîggër', 'nîggêr', 'nîgg3r', 'n1gger', 'n1ggër', 'n1ggêr', 'n1gg3r'];

		if (contentcheck(message, filter)) {
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
