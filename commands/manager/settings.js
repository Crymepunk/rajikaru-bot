const { SlashCommandBuilder } = require('@discordjs/builders');
const { guildTables, guildTableCreate, errembed, updateroles } = require('../../functions');

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
		// Defer reply
		await interaction.deferReply();
		// Check for guild
		if (!interaction.guild) {
			// Return errembed if no guild
            return errembed({ interaction: interaction, author: `This command only works in Guilds!`, defer: true });
        }
		// Assign variables
		const guildTableName = String(interaction.guild.id + '-guild');
		const owner = await interaction.guild.fetchOwner();
		let guildtable = await guildTables.findOne({ where: { name: guildTableName } });
		let manrole;
		// Check for a guildtable
		if (!guildtable) {
			// Create a guildtable if none exists
			guildTableCreate(guildTableName);
			// Reassign guildtable after creation
			guildtable = await guildTables.findOne({ where: { name: guildTableName } });
		} else {
			// If there is a guildtable, fetch the manager role
			manrole = await guildtable.get('manrole');
		}
		// Check if the sender is a manager or owner
		if (interaction.member._roles.includes(manrole) || interaction.member == owner) {
			// Check if subcommand is modrole
			if (interaction.options.getSubcommand() === 'modrole') {
				// Get old modrole
				const previousRole = await guildtable.get('modrole');
				// Get new modrole from command
				const role = interaction.options.getRole('modrole');
				// Update people with the old role to have the new one
				await updateroles({ interaction: interaction, previousRole: previousRole, newRole: role.id });
				// Update the table
				await guildTables.update({ modrole: `${role.id}` }, { where: { name: guildTableName } });
				// Reply saying its done
				await interaction.editReply(`Set moderator role to ${role.name}`);
			// Check if subcommand is manrole
			} else if (interaction.options.getSubcommand() === 'manrole') {
				// Check if sender is owner
				if (interaction.member == owner) {
					// Get old manrole
					const previousRole = await guildtable.get('manrole');
					// Get new manrole from command
					const role = interaction.options.getRole('managerrole');
					// Update people with the old role to have the new one
					await updateroles({ interaction: interaction, previousRole: previousRole, newRole: role.id });
					// Update the table
					await guildTables.update({ manrole: `${role.id}` }, { where: { name: guildTableName } });
					// Reply saying its done
					await interaction.editReply(`Set manager role to ${role.name}`);
				} else {
					// Error if the sender is not owner
					return errembed({ interaction: interaction, author: 'Only the guild owner can change the manager role!' });
				}
			// Check if subcommand is maxinfractions
			} else if (interaction.options.getSubcommand() === 'maxinfractions') {
				// Get integer from command
				const int = interaction.options.getInteger('number');
				// Update the table
				await guildTables.update({ maxinfractions: int }, { where: { name: guildTableName } });
				// Reply saying its done
				await interaction.editReply(`Set max infractions to ${int}`);
			// Check if subcommand is mutedrole
			} else if (interaction.options.getSubcommand() === 'mutedrole') {
				// Get old mutedrole
				const previousRole = await interaction.guild.roles.fetch(guildtable.get('mutedrole'));
				// Get new mutedrole from command
				const role = interaction.options.getRole('mutedrole');
				// Update people with the old role to have the new one
				await updateroles({ interaction: interaction, previousRole: previousRole, newRole: role });
				// Update the table
				await guildTables.update({ mutedrole: `${role.id}` }, { where: { name: guildTableName } });
				// Reply saying its done
				await interaction.editReply(`Set muted role to ${role.name}`);
			}
			// Sync the table
			guildTables.sync();
		} else {
			// Error if they arent owner/doesnt have manrole
			await errembed({ interaction: interaction, author: `You are missing the Manager role.`, defer: true });
		}
	},
};
