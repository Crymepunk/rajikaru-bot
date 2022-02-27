const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { errembed, permcheck, punembed } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans the pinged member')
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for banning')),
        // Builds slash command
	async execute(interaction) {
        if (!interaction.guild) {
            return errembed({ interaction: interaction, author: `This command only works in Guilds!` });
        }
        const member = interaction.options.getMember('member');
        let reason = interaction.options.getString('reason');
        if (!reason) {
            reason = 'No reason provided';
        }

        if (await permcheck({ interaction: interaction, member: member, selfcheck: true, permflag: Permissions.FLAGS.BAN_MEMBERS })) {
            return;
        } else if (interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            member.ban({ days: 0, reason: reason });
            member.send({ embeds: [punembed({ interaction: interaction, reason: reason, punishmenttext: 'banned' })] });
            await interaction.reply(`${member.user} has been banned for "${reason}"`);
        } else {
            return errembed({ interaction: interaction, author: `I am missing the Ban Members permission` });
        }
	},
};
