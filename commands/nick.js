const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nick')
		.setDescription("Give a nickname to the mentioned user.")
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('nick').setDescription('New Nickname').setRequired(true)),
	async execute(interaction) {
        const user = interaction.options.getMember('member');
        const nick = interaction.options.getString('nick');
        user.edit({ nick: nick });
        interaction.reply(`Changed ${user.displayName}'s nickname to ${user.user}`);
    },
};
