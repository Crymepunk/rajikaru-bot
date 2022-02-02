const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addMentionableOption(option => option.setName('role').setDescription('Role to add.')),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const role = interaction.options.getRole('role');
        const usrole = interaction.member.roles.highest;
        if (usrole.comparePositionTo(role) <= role.comparePositionTo(usrole)) {
            interaction.reply({ content: 'This role is equal to or higher than your highest role!', ephemeral: true });
            return;
        } else if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            member.roles.add(role);
        }
	},
};
