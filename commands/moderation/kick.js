const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { errembed, permcheck, dmpunembed, punembed } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription(`Kicks the pinged member.`)
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for kicking')),
	async execute(interaction) {
        // Check if interaction is in a Guild
        if (!interaction.guild) {
            return errembed({ interaction: interaction, author: `This command only works in Guilds!` });
        }
        // Assign variables
        const member = interaction.options.getMember('member');
        let reason = interaction.options.getString('reason');
        if (!reason) {
            reason = 'No reason provided';
        }

        // Check permissions with permcheck from ../functions.js
        if (await permcheck({ interaction: interaction, member: member, selfcheck: true, permflag: Permissions.FLAGS.KICK_MEMBERS == true }) != undefined) {
            return;
        // Check if bot has kick permissions
        } else if (interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            // Send messages in channel and user's DMs
            member.send({ embeds: [dmpunembed({ interaction: interaction, reason: reason, punishmenttext: 'kicked' })] });
            await interaction.reply({ embeds: [punembed({ member: member, reason: reason, punishmenttext: 'banned' })] });
            // Kick command
            member.kick(reason);
        // If bot doesnt have kick permissions return an error
        } else {
            return errembed({ interaction: interaction, author: `I am missing the Kick Members permission` });
        }
	},
};
