const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { contentcheck, guildTables, errembed } = require('../../functions');

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
		const guildTableName = String(interaction.guild.id + '-guild');
		const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
		let modrole;
        let manrole;
        if (guildtable) {
            modrole = await guildtable.get('modrole');
            manrole = await guildtable.get('manrole');
        }

		// Check if user has permissions
		if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			if (!contentcheck(interaction.member._roles, [manrole, modrole])) {
				// Error if not
                return errembed({ interaction: interaction, author: `You are missing the required permissions!` });
			}
		// Check if bot has permissions
		} else if (!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			// Error if not
			return errembed({ interaction: interaction, author: `I am missing the Ban Members permissions!` });
		}

		interaction.guild.members.unban(userId);
		interaction.reply(`${userId} has been unbanned`);
	},
};
