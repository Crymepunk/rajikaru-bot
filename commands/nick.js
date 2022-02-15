const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { MessageEmbed } = require('discord.js');

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

        if (!interaction.guild) {
            await interaction.reply('This command only works in Guilds!');
        } else if (usrole.comparePositionTo(memrole) <= memrole.comparePositionTo(usrole)) {
            const nickemb = new MessageEmbed()
                .setColor("#CC0000")
                .setAuthor({ name: 'Cannot change nickname of someone with the same or higher rank as you.' });
            await interaction.reply({ embeds: [nickemb], ephemeral: true });
            return;
        } else if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {
            if (interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {
            member.edit({ nick: nick });
            await interaction.reply(`Changed ${member.displayName}'s nickname to ${member.user}`);
            } else {
                const nickemb = new MessageEmbed()
                    .setColor("#CC0000")
                    .setAuthor({ name: 'I am missing the Kick Members permission.' });
                await interaction.reply({ embeds: [nickemb], ephemeral: true });
            }
        } else {
            const nickemb = new MessageEmbed()
                .setColor("#CC0000")
                .setAuthor({ name: `You are missing the Manage Nicknames permission.` });
            await interaction.reply({ embeds: [nickemb], ephemeral: true });
        }
    },
};
