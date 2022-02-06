const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildTable, guildTableCreate } = require('../functions');

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
				.setDescription('Max allowed infractions'))
				.addIntegerOption(option => option.setName('number').setDescription('Max number of infractions').setRequired(true)),

	async execute(interaction) {
		const guildtable = await guildTable.findOne({ where: { name: interaction.guild.id } });
		if (!guildtable) {
			guildTableCreate({ name: interaction.guild.id });
		}

		if (interaction.options.getSubcommand() === 'modrole') {
			const role = interaction.options.getRole('modrole');
			await guildTable.update({ modrole: `${role.id}` }, { where: { name: interaction.guild.id } });
			await interaction.reply(`Set moderator role to ${role.name}`);
		} else if (interaction.options.getSubcommand() === 'managerrole') {
			const role = interaction.options.getRole('manrole');
			await guildTable.update({ manrole: `${role.id}` }, { where: { name: interaction.guild.id } });
			await interaction.reply(`Set manager role to ${role.name}`);
		} else if (interaction.options.getSubcommand() === 'maxinfractions') {
			const int = interaction.options.getInteger('number');
			await guildTable.update({ maxinfractions: int - 1 }, { where: { name: interaction.guild.id } });
			await interaction.reply(`Set max infractions to ${int}`);
		} else {
			await interaction.reply('Valid subcommands include modrole, manrole and maxinfractions');
		}
	},
};
