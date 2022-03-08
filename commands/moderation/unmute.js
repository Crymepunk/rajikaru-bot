const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { guildTables, errembed, dmpunembed, punembed, permcheck } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmutes the pinged member.')
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true)),
        // Builds slash command
	async execute(interaction) {
        // Check for guild
        if (!interaction.guild) {
            // Error if no guild
            return errembed({ interaction: interaction, author: `This command only works in Guilds!` });
        }
        // Assign member
        const member = interaction.options.getMember('member');

        // Check for permissions with permcheck function from ../functions.js
        if (await permcheck({ interaction: interaction, member: member, selfcheck: true, permflag: Permissions.FLAGS.MUTE_MEMBERS })) {
            return;
        // Else execute
        } else {
            // Assign variables
            let mutedrole = null;
            const guildTableName = String(interaction.guild.id + '-guild');
            const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
            if (guildtable) {
                mutedrole = await guildtable.get('mutedrole');
            }

            // Check that the member is muted and then unmute the member, otherwise send errembed
            if (member._roles.includes(mutedrole)) {
                await member.roles.remove(mutedrole);
                member.send({ embeds: [dmpunembed({ interaction: interaction, punishmenttext: 'unmuted' })] });
                await interaction.reply({ embeds: [punembed({ member: member, punishmenttext: 'unmuted' })] });
            } else {
                return errembed({ interaction: interaction, author: 'Member is not muted!' });
            }
        }
	},
};
