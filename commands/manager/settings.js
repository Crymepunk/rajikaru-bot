const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { guildTables, guildTableCreate, errembed, updateroles, infractionlist } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Bot Settings.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('modrole')
				.setDescription('Set a moderation role.')
				.addRoleOption(option => option.setName('modrole').setDescription('Select a moderator role.').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('manrole')
				.setDescription('Set a manager role.')
				.addRoleOption(option => option.setName('managerrole').setDescription('Select a manager role.').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('mutedrole')
				.setDescription('Set a muted role.')
				.addRoleOption(option => option.setName('mutedrole').setDescription('Select a muted role.').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('maxinfractions')
				.setDescription('Max allowed infractions')
				.addIntegerOption(option => option.setName('number').setDescription('Max number of infractions.').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('commands')
				.setDescription('Enable/Disable commands.')
				.addStringOption(option => option.setName('option').setDescription('Enable or Disable command.').addChoice('Enable', 'enable').addChoice('Disable', 'disable').setRequired(true))
				.addStringOption(option =>
					option.setName('command')
					.setDescription('Command or Category to change')
					.addChoice('Help', 'help')
					.addChoice('Avatar', 'avatar')
					.addChoice('Userinfo', 'userinfo')
					.addChoice('Serverinfo', 'serverinfo')
					.addChoice('Ping', 'ping')
					.addChoice('Role', 'role')
					.addChoice('Ban', 'ban')
					.addChoice('Unban', 'unban')
					.addChoice('Kick', 'kick')
					.addChoice('Mute', 'mute')
					.addChoice('Unmute', 'unmute')
					.addChoice('Warn', 'warn')
					.addChoice('Infractions', 'infractions')
					.addChoice('Purge', 'purge')
					.addChoice('Nick', 'nick')
					.addChoice('Say', 'say')
					.addChoice('Cuddle', 'cuddle')
					.addChoice('Hug', 'hug')
					.addChoice('Pat', 'pat')
					.addChoice('Slap', 'slap')
					.addChoice('Neko', 'neko')
					.addChoice('Coinflip', 'coinflip')
					.addChoice('8ball', '8ball')
					.addChoice('Owoify', 'owoify')
					.addChoice('Gayrate', 'gayrate').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('disabled_commands')
				.setDescription('List disabled commands')),
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
		const sericon = await interaction.guild.iconURL();
		// Construct embed
		let setemb = new MessageEmbed().setColor('#8C56AB').setAuthor({ name: interaction.guild.name.toString(), iconURL: sericon });
		// Check for a guildtable
		if (!guildtable) {
			// Create a guildtable if none exists
			await guildTableCreate(guildTableName);
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
				// Get new modrole from command
				const role = interaction.options.getRole('modrole');
				// Update the table
				await guildTables.update({ modrole: `${role.id}` }, { where: { name: guildTableName } });
				// Reply saying its done
				setemb = setemb.setDescription(`Set moderator role to: ${role.name}`);
				await interaction.editReply({ embeds: [setemb] });
			// Check if subcommand is manrole
			} else if (interaction.options.getSubcommand() === 'manrole') {
				// Check if sender is owner
				if (interaction.member == owner) {
					// Get new manrole from command
					const role = interaction.options.getRole('managerrole');
					// Update the table
					await guildTables.update({ manrole: `${role.id}` }, { where: { name: guildTableName } });
					// Reply saying its done
					setemb = setemb.setDescription(`Set manager role to: ${role.name}`);
					await interaction.editReply({ embeds: [setemb] });
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
				setemb = setemb.setDescription(`Set max infractions to: ${int }`);
				await interaction.editReply({ embeds: [setemb] });
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
				setemb = setemb.setDescription(`Set muted role to: ${role.name}`);
				await interaction.editReply({ embeds: [setemb] });
			} else if (interaction.options.getSubcommand() === 'commands') {
				const option = interaction.options.getString('option');
				const cmd = interaction.options.getString('command');
				let disCmds = await guildtable.get('disabledcommands');
				if (disCmds) {
					disCmds = disCmds.split('§');
				}
				setemb = setemb.setDescription(`${option.charAt(0).toUpperCase() + option.slice(1)}d ${cmd} command!`);
				if (option == 'disable') {
					if (disCmds) {
						if (disCmds.includes(cmd)) {
							return errembed({ interaction: interaction, author: 'This command is already disabled!', defer: true });
						}
						disCmds.push(cmd);
						disCmds.join('§');
					} else {
						disCmds = cmd;
					}
				} else if (option == 'enable') {
					if (disCmds) {
						if (!disCmds.includes(cmd)) {
							return errembed({ interaction: interaction, author: 'This command is already enabled!', defer: true });
						} else if (disCmds.length > 1) {
							delete disCmds.key(cmd);
							disCmds = disCmds.filter(el => {
								return el != null;
							});
							disCmds = disCmds.join('§');
						// If there's only 1 command then just set disCmds to "null"
						} else {
							disCmds = null;
						}
					} else {
						return errembed({ interaction: interaction, author: 'This command is already enabled!', defer: true });
					}
				}
				// Update the table
				await guildTables.update({ disabledcommands: disCmds }, { where: { name: guildTableName } });
				// Reply saying its done
				await interaction.editReply({ embeds: [setemb] });
			} else if (interaction.options.getSubcommand() === 'disabled_commands') {
				let disCmds = await guildtable.get('disabledcommands');
				if (disCmds) {
					disCmds = disCmds.split('§');
				} else {
					return errembed({ interaction: interaction, author: 'There are no disabled commands!', defer: true });
				}
				disCmds = disCmds.join(', ');
				setemb = setemb.addField('All disabled commands', disCmds);
				await interaction.editReply({ embeds: [setemb] });
			}
			// Sync the table
			guildTables.sync();
		} else {
			// Error if they arent owner/doesnt have manrole
			await errembed({ interaction: interaction, author: `You are missing the Manager role.`, defer: true });
		}
	},
};
