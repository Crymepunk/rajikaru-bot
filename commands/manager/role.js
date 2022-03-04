const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { errembed, permcheck } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Adds role to the pinged user.')
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Role to add.').setRequired(true)),
	async execute(interaction) {
        // Check if interaction is in guild
        if (!interaction.guild) {
            return errembed({ interaction: interaction, author: `This command only works in Guilds!` });
        }
        // Assign variables
        const member = interaction.options.getMember('member');
        const role = interaction.options.getRole('role');
        const brole = interaction.guild.me.roles.highest;
        const usrole = interaction.member.roles.highest;
        // Construct embed
        const roemb = new MessageEmbed()
            .setAuthor({ name: `Added ${role.name} role!` })
            .setDescription(`${interaction.user} added ${role} to ${member}`)
            .setColor('#8C56AB');
        // Check perms using permcheck
        if (await permcheck({
            interaction: interaction,
            selfcheck: false,
            permflag: Permissions.FLAGS.MANAGE_ROLES,
            manonly: true,
            roleposcheck: false,
        })) {
            return;
        // Check role positions
        } else if (usrole.comparePositionTo(role) <= role.comparePositionTo(usrole)) {
            return errembed({ interaction: interaction, author: `You don't have permissions to interact with this role!` });
        // Check bot role positions
        } else if (brole.comparePositionTo(role) <= role.comparePositionTo(brole)) {
            return errembed({ interaction: interaction, author: `I don't have permissions to interact with this role!` });
        // Check if bot has perms
        } else if (interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            // Add role
            if (!member._roles.includes(role.id)) member.roles.add(role);
            else return errembed({ interaction: interaction, author: `${member.user.username} already has this role!` });
            // reply
            return interaction.reply({ embeds: [roemb] });
        } else {
            // Return error if bot has no perms
            return errembed({ interaction: interaction, author: `I am missing the Manage Roles Permission.` });
        }
	},
};
