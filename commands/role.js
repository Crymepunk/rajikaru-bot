const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { MessageEmbed } = require('discord.js');

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
            const roleemb = new MessageEmbed()
                .setColor("#CC0000")
                .setAuthor({ name: 'This role is equal to or higher than your highest role!' });
            await interaction.reply({ embeds: [roleemb], ephemeral: true });
            return;
        } else if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            if (interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            member.roles.add(role);
            } else {
                const roleemb = new MessageEmbed()
                    .setColor("#CC0000")
                    .setAuthor({ name: `I am missing the Manage Roles Permission.` });
                await interaction.reply({ embeds: [roleemb], ephemeral: true });
            }
        } else {
            const roleemb = new MessageEmbed()
                .setColor("#CC0000")
                .setAuthor({ name: `You are missing the Manage Roles Permission.` });
            await interaction.reply({ embeds: [roleemb], ephemeral: true });
        }
	},
};
