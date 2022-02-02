const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, Guild } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Removes messages.')
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of messages to delete.').setRequired(true)),
	async execute(interaction) {
        const limit = interaction.options.getInteger('amount');
        if (Guild.me.member.permissionsIn(interaction.channel).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            if (interaction.member.permissionsIn(interaction.channel).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                await interaction.channel.bulkDelete(limit + 1);
                await interaction.reply(`Chat purged by ${interaction.user}`);
            } else {
                interaction.reply({ content: 'You are missing the **Manage Messages** permission.', ephemeral: true });
            }
        } else {
            interaction.reply({ content: 'I am missing the **Manage Messages** permission.', ephemeral: true });
        }
	},
};
