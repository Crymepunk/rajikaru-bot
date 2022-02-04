const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nick')
		.setDescription("Give a nickname to the mentioned user.")
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('nick').setDescription('New Nickname').setRequired(true)),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const nick = interaction.options.getString('nick');
        const usrole = interaction.member.roles.highest;
        const memrole = member.roles.highest;

        if (usrole.comparePositionTo(memrole) <= memrole.comparePositionTo(usrole)) {
            interaction.reply({ content: 'Cannot change nickname of someone with the same or higher rank as you.', ephemeral: true });
            return;
        } else if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {
            member.edit({ nick: nick });
            interaction.reply(`Changed ${member.displayName}'s nickname to ${member.user}`);
        }
    },
};
