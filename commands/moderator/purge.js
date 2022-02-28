const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { errembed } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Removes messages.')
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of messages to delete.').setRequired(true)),
	async execute(interaction) {
        // Defer reply
        interaction.deferReply({ ephemeral: true });
        // Assign limit
        const limit = interaction.options.getInteger('amount');
        // Check if interaction was in guild
        if (!interaction.guild) {
            // Return error if not
            return errembed({ interaction: interaction, author: 'This command only works in Guilds!', defer: true });
        // Check if member has required permissions
        } else if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            // Check if bot has required permissions
            if (interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                // Delete messages
                await interaction.channel.bulkDelete(limit);
                // Send a reply
                await interaction.editReply(`Purged ${limit} messages!`);
                // Followup the reply
                await interaction.followUp(`Chat purged by ${interaction.user}`);
            } else {
                // Return error if bot doesnt have perms
                return errembed({ interaction: interaction, author: `I am missing the Manage Messages permission.`, defer: true });
            }
        } else {
            // Return error if user doesnt have perms
            return errembed({ interaction: interaction, author: `You are missing the Manage Messages permission.`, defer: true });
        }
	},
};
