const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { guildTables, contentcheck, errembed } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nick')
		.setDescription("Give a nickname to the mentioned user.")
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('nick').setDescription('New Nickname').setRequired(true)),
	async execute(interaction) {
        if (!interaction.guild) {
            return errembed({ interaction: interaction, author: 'This command only works in Guilds!' });
        }
        // Assign all the needed variables (Jesus there are many..)
        const member = interaction.options.getMember('member');
        const nick = interaction.options.getString('nick');
        const brole = interaction.guild.me.roles.highest;
        const usrole = interaction.member.roles.highest;
        const memrole = member.roles.highest;
        const guildTableName = String(interaction.guild.id + '-guild');
		const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
        let modrole;
        let manrole;
        if (guildtable) {
            modrole = await guildtable.get('modrole');
            manrole = await guildtable.get('manrole');
        }
        // Check for permissions
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			if (!contentcheck(interaction.member._roles, [manrole, modrole])) {
                return errembed({ interaction: interaction, author: 'You are missing the required permissions!' });
			}
        // Check for modrole and or manrole and if not check role positions
        } else if (!contentcheck(interaction.member._roles, [manrole, modrole])) {
            if (usrole.comparePositionTo(memrole) <= memrole.comparePositionTo(usrole)) {
                return errembed({ interaction: interaction, author: `Cannot change nickname of someone with the same or higher rank than you`, desc: '||Unless you have set a modrole with /settings modrole||' });
            }
        }
        // Check that the member isnt a moderator
        if (contentcheck(member._roles, [manrole, modrole]) || member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            return errembed({ interaction: interaction, author: 'This member is a Moderator!' });
        // Check that the bot has the right permissions
        } else if (interaction.guild.me.permissions.has(Permissions.FLAGS.CHANGE_NICKNAME)) {
            // Check if member's role position is higher than the bot's
            if (brole.comparePositionTo(memrole) <= memrole.comparePositionTo(brole)) {
                return errembed({ interaction: interaction, author: `This member's highest role is higher than my highest role` });
            // Check if nick is under 32 characters
            } else if (nick.length <= 32) {
                await interaction.reply(`Changed ${member.displayName}'s nickname to ${nick}`);
                // Actual nickname change
                member.edit({ nick: nick });
            // Else send a message about the nickname being too long
            } else {
                await interaction.reply({ content: 'This nickname is too long!', ephemeral: true });
            }
        // If the bot is missing permissions post this
        } else {
            return errembed({ interaction: interaction, author: `I am missing the Change Nickname permission` });
        }
    },
};
