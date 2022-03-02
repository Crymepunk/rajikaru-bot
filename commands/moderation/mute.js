const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { guildTables, errembed, punembed, permcheck } = require('../../functions');

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
        let reason = interaction.options.getString('reason');
        const permFlags = Permissions.FLAGS;
        if (!reason) {
            reason = 'No reason provided';
        }

        if (await permcheck({ interaction: interaction, member: member, selfcheck: true, permflag: Permissions.FLAGS.MUTE_MEMBERS })) {
            return;
        } else {
            // Assign variables
            let mutedrole;
            const guildTableName = String(interaction.guild.id + '-guild');
            const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
            if (guildtable) {
                mutedrole = await interaction.guild.roles.fetch(guildtable.get('mutedrole'));
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
                    } else if (channel.isVoice()) {
                        channel.permissionOverwrites.edit(
                            mutedrole.id,
                            {
                                CONNECT: false,
                            },
                        );
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
