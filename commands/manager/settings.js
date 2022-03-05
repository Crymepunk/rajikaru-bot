const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { guildTables, guildTableCreate, errembed, updateroles, contentcheck, botCommands, removeItemOnce } = require('../../functions');

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
				.addIntegerOption(option => option.setName('number').setDescription('Max number of infractions.').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('commands')
				.setDescription('Enable/Disable commands.')
				.addStringOption(option => option.setName('option').setDescription('Enable or Disable command(s).').addChoice('Enable', 'enable').addChoice('Disable', 'disable').setRequired(true))
				.addStringOption(option =>
					option.setName('command')
					.setDescription('Command(s) or Category to change, seperated by comma.')
					.setRequired(true),
			),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('disabled_commands')
				.setDescription('List disabled commands'),
			),
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
				let cmd = interaction.options.getString('command');
				cmd = cmd.replaceAll(" ", ""); cmd = cmd.split(',');
				let cat;
				if (contentcheck(cmd, ['utility', 'moderation', 'fun'])) {
					let arr;
                    if (cmd.includes('utility')) {
						if (cmd.length > 1) {
							removeItemOnce(cmd, 'utility');
						} else {
							cmd = [];
						}
                        arr = ['help', 'avatar', 'userinfo', 'serverinfo', 'ping'];
                    }
					if (cmd.includes('moderation')) {
						if (cmd.length > 1) {
							removeItemOnce(cmd, 'moderation');
						} else {
							cmd = [];
						}
						if (arr) {
							arr.push('ban', 'unban', 'kick', 'mute', 'unmute', 'warn', 'infractions', 'purge', 'nick', 'say');
						} else {
							arr = ['ban', 'unban', 'kick', 'mute', 'unmute', 'warn', 'infractions', 'purge', 'nick', 'say'];
						}
                    }
					if (cmd.includes('fun')) {
						if (cmd.length > 1) {
							removeItemOnce(cmd, 'fun');
						} else {
							cmd = [];
						}
						if (arr) {
							arr.push('cuddle', 'hug', 'pat', 'slap', 'neko', 'coinflip', '8ball', 'owoify', 'gayrate');
						} else {
							arr = ['cuddle', 'hug', 'pat', 'slap', 'neko', 'coinflip', '8ball', 'owoify', 'gayrate'];
						}
                    }
					cat = true;
					for (const command of arr) {
						if (!cmd.includes(command)) cmd.push(command);
					}
				}
				let disCmds = await guildtable.get('disabledcommands');
				if (disCmds) {
					disCmds = disCmds.split('§');
				}
				setemb = setemb.setDescription(`${option.charAt(0).toUpperCase() + option.slice(1)}d ${cmd.join(', ')} command(s)!`);
				if (option == 'disable') {
					for (const command of cmd) {
						if (command == 'settings') {
							return errembed({ interaction: interaction, author: 'Cannot disable the settings command!', defer: true });
						} else if (!botCommands.includes(command)) {
							return errembed({ interaction: interaction, author: `${command} is not a valid command!`, defer: true });
						} else if (disCmds) {
							if (cat && disCmds.includes(command)) {
								continue;
							} else if (disCmds.includes(command)) {
								return errembed({ interaction: interaction, author: `${command} is already disabled!`, defer: true });
							} else {
								disCmds.push(command);
							}
						} else {
							disCmds = [command];
						}
					}
				} else if (option == 'enable') {
					if (disCmds) {
						for (const command of cmd) {
							console.log(command);
							if (!disCmds.includes(`${command}`)) {
								if (!botCommands.includes(`${command}`)) return errembed({ interaction: interaction, author: `${command} is not a valid command!`, defer: true });
								return errembed({ interaction: interaction, author: 'This command is already enabled!', defer: true });
							} else if (disCmds.length > 1) {
								removeItemOnce(disCmds, command);
							// If there's only 1 command then just set disCmds to "null"
							} else {
								disCmds = null;
							}
						}
					} else {
						return errembed({ interaction: interaction, author: 'This command is already enabled!', defer: true });
					}
				}
				if (disCmds && disCmds[0]) disCmds = disCmds.join('§');
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
