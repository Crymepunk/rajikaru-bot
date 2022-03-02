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
        let vc = 0; let tc = 0;
        let cc = 0; const channels = await interaction.guild.channels.fetch();
        for (let i = 0; i < channels.size; i++) {
            const channel = channels.at(i);
            if (channel.isText()) {
                tc += 1;
            } else if (channel.isVoice()) {
                vc += 1;
            } else if (!channel.isThread()) {
                cc += 1;
            }
        }
        const icon = await interaction.guild.iconURL();
        const owner = await interaction.guild.fetchOwner();
        let roles; await interaction.guild.roles.fetch().then(role => roles = role.size);
        // Construct embed
        const infoemb = new MessageEmbed()
            .setColor("#7ff520")
            .setThumbnail(icon)
            .setAuthor({ name: interaction.guild.name.toString(), iconURL: icon })
            .addFields(
                { name: `Owner`, value: `${owner.user.tag}`, inline: true },
                { name: `Members`, value: `${await interaction.guild.memberCount}`, inline: true },
                { name: `Roles`, value: `${roles}`, inline: true },
                { name: `Category Channels`, value: `${cc}`, inline: true },
                { name: `Text Channels`, value: `${tc}`, inline: true },
                { name: `Voice Channels`, value: `${vc}`, inline: true },
            );
        // Return embed
        return interaction.reply({ embeds: [infoemb], ephemeral: false });
    },
};
