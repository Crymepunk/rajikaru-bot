const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildTables, guildTableCreate } = require('../functions');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Bot Settings')
		.addSubcommand(subcommand =>
			subcommand
				.setName('modrole')
				.setDescription('Set a moderation role.')
				.addRoleOption(option => option.setName('modrole').setDescription('Select a moderator role').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('manrole')
				.setDescription('Set a manager role.')
				.addRoleOption(option => option.setName('managerrole').setDescription('Select a manager role').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('maxinfractions')
				.setDescription('Max allowed infractions')
				.addIntegerOption(option => option.setName('number').setDescription('Max number of infractions').setRequired(true))),
	async execute(interaction) {
		const guildTableName = String(interaction.guild.id + '-guild');
		const owner = await interaction.guild.fetchOwner();
		let guildtable = await guildTables.findOne({ where: { name: guildTableName } });
		if (!interaction.guild) {
			const setemb = new MessageEmbed()
				.setColor("#CC0000")
				.setAuthor({ name: `This command only works in Guilds!` });
			await interaction.reply({ embeds: [setemb] });
        } else if (!guildtable) {
			guildTableCreate(guildTableName);
			guildtable = await guildTables.findOne({ where: { name: guildTableName } });
		}
		const manrole = await guildtable.get('manrole');
		if (interaction.member._roles.includes(manrole) || interaction.member == owner) {
			if (interaction.options.getSubcommand() === 'modrole') {
				const role = interaction.options.getRole('modrole');
				await guildTables.update({ modrole: `${role.id}` }, { where: { name: guildTableName } });
				await interaction.reply(`Set moderator role to ${role.name}`);
			} else if (interaction.options.getSubcommand() === 'manrole') {
				if (interaction.member == owner) {
					const role = interaction.options.getRole('managerrole');
					await guildTables.update({ manrole: `${role.id}` }, { where: { name: guildTableName } });
					await interaction.reply(`Set manager role to ${role.name}`);
				} else {
					return interaction.reply('Only the guild owner can change the manager role!');
				}
			} else if (interaction.options.getSubcommand() === 'maxinfractions') {
				const int = interaction.options.getInteger('number');
				await guildTables.update({ maxinfractions: int }, { where: { name: guildTableName } });
				await interaction.reply(`Set max infractions to ${int}`);
			}
			guildTables.sync();
		} else {
			const setemb = new MessageEmbed()
				.setColor("#CC0000")
				.setAuthor({ name: `You are missing the Manager role.` });
			await interaction.reply({ embeds: [setemb], ephemeral: true });
		}
	},
};
