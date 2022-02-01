const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Says the message you tell it to say.')
        .addStringOption(option => option.setName('message').setDescription('Message to say').setRequired(true)),
	async execute(interaction) {
        const message = interaction.options.getString('message');
		await interaction.reply(message);
	},
};
