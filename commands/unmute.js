const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { contentcheck, guildTables, errembed, punembed } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmutes the pinged member.')
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true)),
        // Builds slash command
	async execute(interaction) {
        if (!interaction.guild) {
            return errembed({ interaction: interaction, author: `This command only works in Guilds!` });
        }
        const member = interaction.options.getMember('member');
        const brole = interaction.guild.me.roles.highest;
        const usrole = interaction.member.roles.highest;
        const memrole = member.roles.highest;
        const owner = interaction.guild.fetchOwner();
        if (interaction.member != owner) {
            const guildTableName = String(interaction.guild.id + '-guild');
            const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
            let modrole = null;
            let manrole = null;
            if (guildtable) {
                modrole = await guildtable.get('modrole');
                manrole = await guildtable.get('manrole');
            }
            if (interaction.member == member) {
                return errembed({ interaction: interaction, author: `Please ping someone else to mute!` });
            } else if (!interaction.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) {
                if (!contentcheck(interaction.member._roles, [manrole, modrole])) {
                    return errembed({ interaction: interaction, author: 'You are missing the required permissions!' });
                }
            } else if (!contentcheck(interaction.member._roles, [manrole, modrole])) {
                if (usrole.comparePositionTo(memrole) <= memrole.comparePositionTo(usrole)) {
                    return errembed({ interaction: interaction, author: `Cannot mute someone with the same or higher rank than you`, desc: '||Unless you have set a modrole with /settings modrole||' });
                }
            }
            if (contentcheck(member._roles, [manrole, modrole]) || member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
                return errembed({ interaction: interaction, author: 'Cannot mute a Moderator!' });
            }
        }
        if (brole.comparePositionTo(memrole) <= memrole.comparePositionTo(brole)) {
            return errembed({ interaction: interaction, author: `This member's highest role is higher than my highest role` });
        } else {
            let mutedrole = null;
            const guildTableName = String(interaction.guild.id + '-guild');
            const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
            if (guildtable) {
                mutedrole = await guildtable.get('mutedrole');
            }

            // Check that the member is muted and then unmute the member, otherwise send errembed
            if (member._roles.includes(mutedrole)) {
                await member.roles.remove(mutedrole);
                member.send({ embeds: [punembed({ interaction: interaction, punishmenttext: 'unmuted' })] });
                await interaction.reply({ content: `${member.user} has been unmuted`, ephemeral: true });
            } else {
                return errembed({ interaction: interaction, author: 'Member is not muted!' });
            }
        }
	},
};
