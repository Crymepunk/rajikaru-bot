const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { contentcheck, guildTables, errembed, punembed } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mutes the pinged member.')
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for muting')),
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
        let reason = interaction.options.getString('reason');
        const permFlags = Permissions.FLAGS;
        if (!reason) {
            reason = 'No reason provided';
        }
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
            if (!mutedrole) {
                // TODO: Make it so it only modifies the permissions of the categories and have the channels sync permissions with them
                // Creates role with the name "Muted"
                mutedrole = await interaction.guild.roles.create(
                    {
                        name: 'Muted',
                        reason: 'Created muted role for mute command.',
                        permissions: [
                            permFlags.VIEW_CHANNEL,
                            permFlags.READ_MESSAGE_HISTORY,
                        ],
                    });
				await guildTables.update({ mutedrole: `${mutedrole.id}` }, { where: { name: guildTableName } });

                // Denies the SEND_MESSAGES, ADD_REACTIONS, and CONNECT permissions for the muted role in each channel
                // lockPermissions() synchronizes the channel permissions with the category permissions
                for (let channel of interaction.guild.channels.cache) {
                    channel = channel.at(1);
                    if (channel.type === 'GUILD_CATEGORY') {
                        channel.permissionOverwrites.edit(
                            mutedrole.id,
                            {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false,
                                CONNECT: false,
                            },
                        );
                    } else if (channel.isText() || channel.isThread()) {
                        channel.permissionOverwrites.edit(
                            mutedrole.id,
                            {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false,
                            },
                        );
                        await channel.lockPermissions();
                    } else if (channel.isVoice()) {
                        channel.permissionOverwrites.edit(
                            mutedrole.id,
                            {
                                CONNECT: false,
                            },
                        );
                        await channel.lockPermissions();
                    }
                }
            }
            // Check that the member isn't already muted and then mute the member, otherwise send errembed
            if (!member._roles.includes(mutedrole)) {
                member.send({ embeds: [punembed({ interaction: interaction, reason: reason, punishmenttext: 'muted' })] });
                await interaction.reply({ content: `${member.user} has been muted for "${reason}"`, ephemeral: true });
                await member.roles.add(mutedrole);
            } else {
                return errembed({ interaction: interaction, author: 'Member is already muted!' });
            }
        }
	},
};
