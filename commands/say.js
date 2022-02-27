const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { contentcheck, guildTables, errembed } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Says the message you tell it to say.')
        .addStringOption(option => option.setName('message').setDescription('Message to say').setRequired(true)),
	async execute(interaction) {
        const message = interaction.options.getString('message');
		const guildTableName = String(interaction.guild.id + '-guild');
        const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
        let modrole;
        let manrole;
        if (guildtable) {
            modrole = await guildtable.get('modrole');
            manrole = await guildtable.get('manrole');
        }

		if (!interaction.guild) {
			await interaction.reply(message);
		} else if (contentcheck(message, ['nigger', 'niggër', 'niggêr', 'nigg3r', 'nïgger', 'nïggër', 'nïggêr', 'nïgg3r', 'nîgger', 'nîggër', 'nîggêr', 'nîgg3r', 'n1gger', 'n1ggër', 'n1ggêr', 'n1gg3r'])) {
			await interaction.reply({ content: 'This contains a bad word.', ephemeral: true });
		} else if (contentcheck(interaction.member._roles, [modrole, manrole]) || interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
			await interaction.reply(message);
		} else {
			return errembed({ interaction: interaction, author: 'You are missing the Manage Server permission.', desc: 'Needed to prevent spam and stop bad word usage, etc.' });
		}
	},
};
