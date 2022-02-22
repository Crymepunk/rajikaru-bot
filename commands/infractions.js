const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const { userTables, randomColor, infractionlist, contentcheck, errembed, guildTables } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('infractions')
		.setDescription('How many infractions the user has and what they are.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List the users infractions')
                .addUserOption(option => option.setName('user').setDescription('User to check.').setRequired(true)))
        .addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove an infraction.')
				.addUserOption(option => option.setName('user').setDescription('User to remove from').setRequired(true))
                .addIntegerOption(option => option.setName('infractionnum').setDescription('Which infraction to remove').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription('Clears ALL infractions!!!')
                .addUserOption(option => option.setName('user').setDescription('User to clear').setRequired(true))),
	async execute(interaction) {
        await interaction.deferReply();
        if (!interaction.guild) {
            return interaction.editReply('This command only works in Guilds!');
        }
        // Assign variables
        const user = interaction.options.getUser('user');
        const guildTableName = String(interaction.guild.id + '-guild');
		const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
        let modrole;
        let manrole;
        if (guildtable) {
            modrole = await guildtable.get('modrole');
            manrole = await guildtable.get('manrole');
        }
        const userTableName = `${interaction.guild.id}-${user.id}`;
        const usertable = await userTables.findOne({ where: { name: userTableName } });
        let infractions = usertable.get('infractions');
        if (infractions) {
            infractions = infractions.split('§');
        }

        // Permission checks!
        if (!interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
			if (!contentcheck(interaction.member._roles, [manrole, modrole])) {
                return errembed({ interaction: interaction, author: 'You are missing the required permissions!', defer: true });
            }
        }

        if (interaction.options.getSubcommand() === 'remove') {
            // If the command is remove then get the infraction number from the users input
            const int = interaction.options.getInteger('infractionnum');
            // If there's more than one infraction then remove the requested infraction
            if (infractions.length > 1) {
                delete infractions[int - 1];
                infractions = infractions.filter(el => {
                    return el != null;
                });
                infractions = infractions.join('§');
            // If there's only 1 infraction then just set infractions to "null"
            } else {
                infractions = null;
            }
            // Send the updated infractions to the database
            await userTables.update({ infractions: infractions }, { where: { name: userTableName } });
            // Send a message saying it was removed
            await interaction.editReply({ content: `Removed infraction number '${int}'.`, ephemeral: true });
        } else if (interaction.options.getSubcommand() === 'clear') {
            // If the command is clear then just set infractions to "null"
            infractions = null;
            // Update database table
            await userTables.update({ infractions: infractions }, { where: { name: userTableName } });
            // Send a message saying its all cleared
            await interaction.editReply({ content: `Removed all infractions.`, ephemeral: true });
        } else if (interaction.options.getSubcommand() === 'list') {
            // Assign a value to "inf" so it can be used later without issue
            let inf = '';
            if (infractions && infractions[0]) {inf += infractionlist(infractions);}
            else {
                // No infractions embed
                const infemb = new MessageEmbed()
                    .setColor("#CC0000")
                    .setAuthor({ name: `${user.tag} has no infractions`, iconURL: `${user.avatarURL()}?size=1024` });
                // Send the embed
                return interaction.editReply({ embeds: [infemb] });
            }

            // Infractions embed
            const infemb = new MessageEmbed()
                // TODO: Set a color instead of using randomColor()
                .setColor(randomColor())
                .setTitle(`${user.username}'s infractions`)
                .addFields(
                    { name: 'Total', value: `${infractions.length}` },
                    { name: 'Last 10 infractions', value: inf },
                )
                .setThumbnail(`${user.avatarURL()}?size=1024`);
            // Send the embed
            interaction.editReply({ embeds: [infemb] });
        }
	},
};
