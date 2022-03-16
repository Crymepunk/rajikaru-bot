const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { guildTables, errembed, dmpunembed, punembed, permcheck } = require('../../functions');

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
        await interaction.deferReply();
        const member = interaction.options.getMember('member');
        let reason = interaction.options.getString('reason');
        const permFlags = Permissions.FLAGS;
        if (!reason) {
            reason = 'No reason provided';
        }

        // Check for permissions with permcheck function from functions.js
        if (await permcheck({ interaction: interaction, member: member, selfcheck: true, permflag: Permissions.FLAGS.MUTE_MEMBERS, roleposcheck: false })) {
            return;
        } else {
            // Assign variables
            let mutedrole;
            const guildTableName = String(interaction.guild.id + '-guild');
            const guildtable = await guildTables.findOne({ where: { name: guildTableName } });

            // Checks if guildtable exists, then attempts to fetch the mutedrole ID from the database
            if (guildtable && await guildtable.get('mutedrole')) {
                mutedrole = await interaction.guild.roles.fetch(await guildtable.get('mutedrole'));
            }
            // If the mutedrole isn't fetched, checks if a role called 'Muted' already exists, otherwise it creates one
            if (!mutedrole) {
                if (await interaction.guild.roles.cache.has('Muted')) {
                    mutedrole = await interaction.guild.roles.cache.find(r => r == 'Muted');
                } else {
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

                    // Updates the guildtable with the mutedrole ID
                    await guildTables.update({ mutedrole: `${mutedrole.id}` }, { where: { name: guildTableName } });

                    for (let channel of interaction.guild.channels.cache) {
                        // The channels cache is a Collection<Snowflake, Channel>
                        // so this gets the channel object at index 1
                        channel = channel.at(1);
                        // Gets the bot user's permissions for the channel
                        const channelPerms = await channel.permissionsFor(interaction.guild.me);
                        // Gets the permissionsLocked property of channel, which tells us if
                        // the channel perms are synced with the parent category perms
                        const permissionsLocked = channel.permissionsLocked;
                        // Checks if the bot has permission to view and manage the channel
                        if (channelPerms.has(permFlags.VIEW_CHANNEL) && channelPerms.has(permFlags.MANAGE_CHANNELS)) {
                            // Denies the SEND_MESSAGES, ADD_REACTIONS, and CONNECT permissions for the muted role in each channel
                            // depending on what type of channel it is
                            if (channel.type == 'GUILD_CATEGORY') {
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
                            } else if (channel.isVoice()) {
                                channel.permissionOverwrites.edit(
                                    mutedrole.id,
                                    {
                                        CONNECT: false,
                                    },
                                );
                            }
                            // Checks if the channel permissions were synced with the category permissions before
                            // it added the overwrites for the Muted role, then syncs permissions if true
                            if (permissionsLocked) {
                                await channel.lockPermissions();
                            }
                        }
                    }
                }
            }

            // Check that the member isn't already muted and then mute the member, otherwise send errembed
            if (!member._roles.includes(mutedrole.id)) {
                await member.roles.add(mutedrole);
                member.send({ embeds: [dmpunembed({ interaction: interaction, reason: reason, punishmenttext: 'muted' })] });
                await interaction.editReply({ embeds: [punembed({ member: member, reason: reason, punishmenttext: 'muted' })] });
            } else {
                return errembed({ interaction: interaction, author: 'Member is already muted!', defer: true });
            }
        }
	},
};
