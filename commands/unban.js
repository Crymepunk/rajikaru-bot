const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { contentcheck, guildTables } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unbans the specified user.')
        .addUserOption(option => option.setName('user').setDescription('User to unban.').setRequired(true)),
	async execute(interaction) {
		const userId = interaction.options.get('user')?.value;
		const owner = await interaction.guild.fetchOwner();
		const guildTableName = String(interaction.guild.id + '-guild');
		const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
		let modrole = null;
        let manrole = null;
        if (guildtable) {
            modrole = await guildtable.get('modrole');
            manrole = await guildtable.get('manrole');
        }

		if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS) || interaction.member == owner) {
			if (!contentcheck(interaction.member._roles, [manrole, modrole])) {
				return interaction.reply('You are missing the required permissions!');
			}
		} else if (!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			return interaction.reply('I am missing the required permissions!');
		}

		interaction.guild.members.unban(userId);
		interaction.reply(`${userId} has been unbanned`);
	},
};
