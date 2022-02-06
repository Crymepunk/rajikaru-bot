const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildTables, guildTableCreate } = require('../functions');

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
		const guildTableName = `${interaction.guild.id}`;
		const guildtable = await guildTables.findOne({ where: { name: guildTableName } });

		if (!guildtable) {
			guildTableCreate({ name: guildTableName });
		}

		if (interaction.guild == null) {
            return interaction.reply('This command only works in Guilds!');
        } else if (interaction.options.getSubcommand() === 'modrole') {
			const role = interaction.options.getRole('modrole');
			await guildTables.update({ modrole: `${role.id}` }, { where: { name: guildTableName } });
			await interaction.reply(`Set moderator role to ${role.name}`);
		} else if (interaction.options.getSubcommand() === 'managerrole') {
			const role = interaction.options.getRole('manrole');
			await guildTables.update({ manrole: `${role.id}` }, { where: { name: guildTableName } });
			await interaction.reply(`Set manager role to ${role.name}`);
		} else if (interaction.options.getSubcommand() === 'maxinfractions') {
			const int = interaction.options.getInteger('number');
			await guildTables.update({ maxinfractions: int - 1 }, { where: { name: guildTableName } });
			await interaction.reply(`Set max infractions to ${int}`);
		}
		guildTables.sync();
	},
};
