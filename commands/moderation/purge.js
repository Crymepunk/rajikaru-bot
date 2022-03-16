const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { errembed, guildTables, contentcheck } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Removes messages.')
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of messages to delete.').setRequired(true)),
	async execute(interaction) {
        // Defer reply
        interaction.deferReply({ ephemeral: true });
        // Check if interaction was in guild
        if (!interaction.guild) {
            // Return error if not
            return errembed({ interaction: interaction, author: 'This command only works in Guilds!', defer: true });
        }
        // Assign variables
        const limit = interaction.options.getInteger('amount');
        const guildTableName = String(interaction.guild.id + '-guild');
        const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
        let modrole;
        let manrole;
        if (guildtable) {
            modrole = await guildtable.get('modrole');
            manrole = await guildtable.get('manrole');
        }
        // Construct embed
        const puremb = new MessageEmbed()
            .setColor('#5B92E5')
            .setAuthor({ name: `Purged ${limit} messages` })
            .setDescription(`Chat purged by ${interaction.user}`);
        // Check if member has required permissions
        if (contentcheck(interaction.member._roles, [modrole, manrole]) || interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            // Check if bot has required permissions
            if (interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                // Delete messages
                await interaction.channel.bulkDelete(limit);
                // Send a reply
                await interaction.editReply(`Purged ${limit} messages!`);
                // Followup the reply
                await interaction.followUp({ embeds: [puremb] });
            } else {
                // Return error if bot doesnt have perms
                return errembed({ interaction: interaction, author: `I am missing the Manage Messages permission.`, defer: true });
            }
        } else {
            // Return error if user doesnt have perms
            return errembed({ interaction: interaction, author: `You are missing the required permissions.`, defer: true });
        }
	},
};
