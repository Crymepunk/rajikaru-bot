const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildTables, guildTableCreate, errembed, updateroles } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Bot Settings.')
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
				.setName('mutedrole')
				.setDescription('Set a muted role.')
				.addRoleOption(option => option.setName('mutedrole').setDescription('Select a muted role.').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('maxinfractions')
				.setDescription('Max allowed infractions')
				.addIntegerOption(option => option.setName('number').setDescription('Max number of infractions').setRequired(true))),
		// Builds slash command.
	async execute(interaction) {
		await interaction.deferReply();
		const guildTableName = String(interaction.guild.id + '-guild');
		const owner = await interaction.guild.fetchOwner();
		let guildtable = await guildTables.findOne({ where: { name: guildTableName } });
		if (!interaction.guild) {
            return errembed({ interaction: interaction, author: `This command only works in Guilds!` });
        } else if (!guildtable) {
			guildTableCreate(guildTableName);
			guildtable = await guildTables.findOne({ where: { name: guildTableName } });
		}
		const manrole = await guildtable.get('manrole');
		if (interaction.member._roles.includes(manrole) || interaction.member == owner) {
			if (interaction.options.getSubcommand() === 'modrole') {
				const previousRole = await guildtable.get('modrole');
				const role = interaction.options.getRole('modrole');
				await updateroles({ interaction: interaction, previousRole: previousRole, newRole: role.id });
				await guildTables.update({ modrole: `${role.id}` }, { where: { name: guildTableName } });
				await interaction.editReply(`Set moderator role to ${role.name}`);
			} else if (interaction.options.getSubcommand() === 'manrole') {
				if (interaction.member == owner) {
					const previousRole = await guildtable.get('manrole');
					const role = interaction.options.getRole('managerrole');
					await updateroles({ interaction: interaction, previousRole: previousRole, newRole: role.id });
					await guildTables.update({ manrole: `${role.id}` }, { where: { name: guildTableName } });
					await interaction.editReply(`Set manager role to ${role.name}`);
				} else {
					return errembed({ interaction: interaction, author: 'Only the guild owner can change the manager role!' });
				}
			} else if (interaction.options.getSubcommand() === 'maxinfractions') {
				const int = interaction.options.getInteger('number');
				await guildTables.update({ maxinfractions: int }, { where: { name: guildTableName } });
				await interaction.editReply(`Set max infractions to ${int}`);
			} else if (interaction.options.getSubcommand() === 'mutedrole') {
				console.log('here');
				const previousRole = await interaction.guild.roles.fetch(guildtable.get('mutedrole'));
				const role = interaction.options.getRole('mutedrole');
				console.log('here 2');
				await updateroles({ interaction: interaction, previousRole: previousRole, newRole: role });
				console.log('here 3');
				await guildTables.update({ mutedrole: `${role.id}` }, { where: { name: guildTableName } });
				await interaction.editReply(`Set muted role to ${role.name}`);
				console.log('here 3');
			}
			guildTables.sync();
		} else {
			await errembed({ interaction: interaction, author: `You are missing the Manager role.` });
		}
	},
};
