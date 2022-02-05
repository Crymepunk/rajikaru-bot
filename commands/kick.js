const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription(`Kicks the pinged member.`)
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for kicking')),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        let reason = interaction.options.getString('reason');
        const usrole = interaction.member.roles.highest;
        const memrole = member.roles.highest;

        if (interaction.guild == null) {
            interaction.reply('This command only works in Guilds!');
        } else {
            if (!reason) {
                reason = 'No reason provided';
            }

            if (interaction.member == member) {
                interaction.reply({ content: 'Please ping someone else to kick.', ephemeral: true });
            } else if (usrole.comparePositionTo(memrole) <= memrole.comparePositionTo(usrole)) {
                interaction.reply({ content: 'Cannot kick someone with the same or higher rank as you.', ephemeral: true });
                return;
            } else if (interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
                if (interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
                    interaction.reply(`${member.user} has been kicked for "${reason}"`);
                    member.kick(reason);
                } else {
                    await interaction.reply({ content: 'I am missing the **Kick Members** permission.', ephemeral: true });
                }
            } else {
                interaction.reply({ content: 'You are missing the **Kick Members** permission.', ephemeral: true });
            }
        }
	},
};
