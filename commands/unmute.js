const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { guildTables, errembed, punembed, permcheck } = require('../functions');

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

        if (await permcheck({ interaction: interaction, member: member, selfcheck: true, permflag: Permissions.FLAGS.MUTE_MEMBERS })) {
            return;
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
