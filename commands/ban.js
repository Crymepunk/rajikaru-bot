const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans the pinged member')
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for banning')),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        let reason = interaction.options.getString('reason');
        const usrole = interaction.member.roles.highest;
        const memrole = member.roles.highest;

        if (!reason) {
            reason = 'No reason provided';
        }

        if (usrole.comparePositionTo(memrole) <= memrole.comparePositionTo(usrole)) {
            interaction.reply('Cannot ban someone with the same or higher rank as you.');
            return;
        } else if (interaction.user == member) {
            interaction.reply('Please ping someone else to ban.');
        } else if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            interaction.reply(`${member.user} has been banned for "${reason}"`);
            member.ban({ days: 0, reason: reason });
        }
	},
};
