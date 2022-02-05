const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Removes messages.')
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of messages to delete.').setRequired(true)),
	async execute(interaction) {
        const limit = interaction.options.getInteger('amount');
        if (interaction.guild == null) {
            await interaction.reply('This command only works in Guilds!');
        } else if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            if (interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                await interaction.channel.bulkDelete(limit);
                await interaction.reply(`Chat purged by ${interaction.user}`);
            } else {
                await interaction.reply({ content: 'I am missing the **Manage Messages** permission.', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'You are missing the **Manage Messages** permission.', ephemeral: true });
        }
	},
};
