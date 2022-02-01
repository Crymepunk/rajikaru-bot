const { SlashCommandBuilder } = require('@discordjs/builders');
const { friendserver } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Removes messages.')
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of messages to delete.').setRequired(true)),
	async execute(interaction) {
        if (interaction.guild != friendserver) {
            const limit = interaction.options.getInteger('amount');
            await interaction.channel.bulkDelete(limit + 1);
            await interaction.reply(`Chat purged by ${interaction.user}`);
        }
	},
};
