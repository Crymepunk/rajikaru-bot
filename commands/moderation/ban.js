const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { errembed, permcheck, dmpunembed, punembed } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans the pinged member')
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for banning')),
        // Builds slash command
	async execute(interaction) {
        // Check if interaction is in a guild
        if (!interaction.guild) {
            // Error if not
            return errembed({ interaction: interaction, author: `This command only works in Guilds!` });
        }
        // Assign variables
        const member = interaction.options.getMember('member');
        let reason = interaction.options.getString('reason');
        // If there's no reason attached set it to "No reason provided"
        if (!reason) {
            reason = 'No reason provided';
        }

        // Check permissions with permcheck function from ../functions.js
        if (await permcheck({ interaction: interaction, member: member, selfcheck: true, permflag: Permissions.FLAGS.BAN_MEMBERS })) {
            return;
        // Check if bot has permissions to ban
        } else if (interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            // Send out ban messages
            member.send({ embeds: [dmpunembed({ interaction: interaction, reason: reason, punishmenttext: 'banned' })] });
            await interaction.reply({ embeds: [punembed({ member: member, reason: reason, punishmenttext: 'banned' })] });
            // Actually ban the member
            member.ban({ days: 0, reason: reason });
        // If bot doesnt have the right perms return an errembed
        } else {
            return errembed({ interaction: interaction, author: `I am missing the Ban Members permission` });
        }
	},
};
