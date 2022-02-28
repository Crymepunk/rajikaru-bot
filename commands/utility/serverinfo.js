const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { errembed } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Replies with server info.'),
        // Builds the slash command
	async execute(interaction) {
        // Check if interaction is in guild
        if (!interaction.guild) {
            // Return errembed if not
            return errembed({ interaction: interaction, author: 'This command only works in Guilds!' });
        }
        // Assign variables
        const icon = await interaction.guild.iconURL();
        const owner = await interaction.guild.fetchOwner();
        let roles; await interaction.guild.roles.fetch().then(role => roles = role.size);
        // Construct embed
        const infoemb = new MessageEmbed()
            .setColor("#5B92E5")
            .setThumbnail(icon)
            .setTitle('Server Info')
            .setDescription(await interaction.guild.name.toString())
            .addFields(
                { name: `Owner:`, value: `${owner.user.tag}`, inline: true },
                { name: `Members`, value: `${await interaction.guild.memberCount}`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: `Roles`, value: `${roles}`, inline: true },
                { name: `Channels`, value: `${await interaction.guild.channels.channelCountWithoutThreads}`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
            );
        // Return embed
        return interaction.reply({ embeds: [infoemb], ephemeral: false });
    },
};
