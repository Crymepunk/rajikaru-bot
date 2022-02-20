const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { contentcheck, guildTables, errembed } = require('../functions');

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
        const brole = interaction.guild.me.roles.highest;
        const usrole = interaction.member.roles.highest;
        const memrole = member.roles.highest;
        const guildTableName = String(interaction.guild.id + '-guild');
		const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
        let reason = interaction.options.getString('reason');
		let modrole = null;
        let manrole = null;
        if (guildtable) {
            modrole = await guildtable.get('modrole');
            manrole = await guildtable.get('manrole');
        }
        if (!reason) {
            reason = 'No reason provided';
        }
        if (interaction.member == member) {
            return errembed({ interaction: interaction, author: `Please ping someone else to ban!` });
        } else if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			if (!contentcheck(interaction.member._roles, [manrole, modrole])) {
                return errembed({ interaction: interaction, author: 'You are missing the required permissions!' });
			}
        } else if (!contentcheck(interaction.member._roles, [manrole, modrole])) {
            if (usrole.comparePositionTo(memrole) <= memrole.comparePositionTo(usrole)) {
                return errembed({ interaction: interaction, author: `Cannot ban someone with the same or higher rank than you`, desc: '||Unless you have set a modrole with /settings modrole||' });
            }
        }
        if (contentcheck(member._roles, [manrole, modrole]) || member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            return errembed({ interaction: interaction, author: 'Cannot ban a Moderator!' });
        } else if (interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            if (brole.comparePositionTo(memrole) <= memrole.comparePositionTo(brole)) {
                return errembed({ interaction: interaction, author: `This member's highest role is higher than my highest role` });
            } else {
                member.send(`You have been banned from ${interaction.guild.name} for "${reason}"`);
                await interaction.reply(`${member.user} has been banned for "${reason}"`);
                member.ban({ days: 0, reason: reason });
            }
        } else {
            return errembed({ interaction: interaction, author: `I am missing the Ban Members permission` });
        }
	},
};
