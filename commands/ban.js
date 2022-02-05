const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans the pinged member')
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for banning')),
	async execute(interaction) {
        if (interaction.guild == null) {
            await interaction.reply('This command only works in Guilds!');
        } else {
            const member = interaction.options.getMember('member');
            let reason = interaction.options.getString('reason');
            const usrole = interaction.member.roles.highest;
            const memrole = member.roles.highest;

            if (!reason) {
                reason = 'No reason provided';
            }

            if (interaction.member == member) {
                await interaction.reply({ content: 'Please ping someone else to ban.', ephemeral: true });
            } else if (usrole.comparePositionTo(memrole) <= memrole.comparePositionTo(usrole)) {
                await interaction.reply({ content: 'Cannot ban someone with the same or higher rank as you.', ephemeral: true });
                return;
            } else if (interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
                if (interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
                    await interaction.reply(`${member.user} has been banned for "${reason}"`);
                    member.ban({ days: 0, reason: reason });
                } else {
                    await interaction.reply({ content: 'I am missing the **Kick Members** permission.', ephemeral: true });
                }
            } else {
                await interaction.reply({ content: 'You are missing the **Kick Members** permission.', ephemeral: true });
            }
        }
	},
};
