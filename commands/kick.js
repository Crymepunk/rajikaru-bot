const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { contentcheck, guildTables, errembed } = require('../functions');

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
        const brole = interaction.guild.me.roles.highest;
        const usrole = interaction.member.roles.highest;
        const memrole = member.roles.highest;
        const guildTableName = String(interaction.guild.id + '-guild');
		const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
        let reason = interaction.options.getString('reason');
		let modrole;
        let manrole;
        if (guildtable) {
            modrole = await guildtable.get('modrole');
            manrole = await guildtable.get('manrole');
        }
        if (!reason) {
            reason = 'No reason provided';
        }
        // Check if member is sender and if so send an error message
        if (interaction.member == member) {
            return errembed({ interaction: interaction, author: `Please ping someone else to kick!` });
        // Check for permissions
        } else if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
			if (!contentcheck(interaction.member._roles, [manrole, modrole])) {
                return errembed({ interaction: interaction, author: 'You are missing the required permissions!' });
			}
        // Check for modrole and or manrole and if not check role positions
        } else if (!contentcheck(interaction.member._roles, [manrole, modrole])) {
            if (usrole.comparePositionTo(memrole) <= memrole.comparePositionTo(usrole)) {
                return errembed({ interaction: interaction, author: `Cannot kick someone with the same or higher rank than you`, desc: '||Unless you have set a modrole with /settings modrole||' });
            }
        }
        // Check that member isnt a moderator
        if (contentcheck(member._roles, [manrole, modrole]) || member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            return errembed({ interaction: interaction, author: 'Cannot ban a Moderator!' });
        // Check if bot has kick permissions
        } else if (interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            // Check if member's role position is higher than the bot's
            if (brole.comparePositionTo(memrole) <= memrole.comparePositionTo(brole)) {
                return errembed({ interaction: interaction, author: `This member's highest role is higher than my highest role` });
            // Else kick the user
            } else {
                member.send(`You have been kicked from ${interaction.guild.name} for "${reason}"`);
                await interaction.reply(`${member.user} has been kicked for "${reason}"`);
                // Kick command
                member.kick(reason);
            }
        // If bot doesnt have kick permissions return an error
        } else {
            return errembed({ interaction: interaction, author: `I am missing the Kick Members permission` });
        }
	},
};
