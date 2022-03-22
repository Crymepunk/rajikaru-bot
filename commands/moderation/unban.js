const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { permcheck, errembed, punembed } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unbans the specified user.')
        .addUserOption(option => option.setName('user').setDescription('User to unban.').setRequired(true)),
	async execute(interaction) {
		// Check if interaction is in guild
		if (!interaction.guild) {
            return errembed({ interaction: interaction, author: 'This command only works in Guilds!' });
        }
		// Assign variables
		const userId = interaction.options.get('user')?.value;
		const user = interaction.options.getUser('user');

		// Check if user has permissions
		switch (await permcheck({ interaction: interaction, permflag: Permissions.FLAGS.MUTE_MEMBERS })) {
			case true:
				return;
			default:
				const banlist = await interaction.guild.bans.fetch();
				if (banlist.find(bluser => bluser.id == userId)) {
					interaction.guild.members.unban(userId);
					await interaction.reply({ embeds: [punembed({ member: user, punishmenttext: 'unbanned' })] });
				} else {
					await errembed({ interaction: interaction, author: `This user is not banned.` });
				}
		}
	},
};
