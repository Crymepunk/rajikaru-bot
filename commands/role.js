const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Adds role to the pinged user.')
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addMentionableOption(option => option.setName('role').setDescription('Role to add.').setRequired(true)),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const role = interaction.options.getRole('role');
        const usrole = interaction.member.roles.highest;
        if (interaction.guild == null) {
            await interaction.reply('This command only works in Guilds!');
        } else if (usrole.comparePositionTo(role) <= role.comparePositionTo(usrole)) {
            await interaction.reply({ content: 'This role is equal to or higher than your highest role!', ephemeral: true });
            return;
        } else if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            if (interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            member.roles.add(role);
            } else {
                await interaction.reply({ content: 'I am missing the **Manage Roles** permission.', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'You are missing the **Manage Roles** permission.', ephemeral: true });
        }
	},
};
