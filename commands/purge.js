const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { errembed } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Removes messages.')
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of messages to delete.').setRequired(true)),
	async execute(interaction) {
        interaction.deferReply();
        const limit = interaction.options.getInteger('amount');
        if (!interaction.guild) {
            return errembed({ interaction: interaction, author: 'This command only works in Guilds!', defer: true });
        } else if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            if (interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                await interaction.channel.bulkDelete(limit);
                await interaction.editReply(`Chat purged by ${interaction.user}`);
            } else {
                return errembed({ interaction: interaction, author: `I am missing the Manage Messages permission.`, defer: true });
            }
        } else {
            return errembed({ interaction: interaction, author: `You are missing the Manage Messages permission.`, defer: true });
        }
	},
};
