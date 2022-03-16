const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shards')
		.setDescription('Shows Shards!'),
	async execute(interaction) {
		// Assign variables
		const shards = await interaction.client.shard.fetchClientValues('guilds.cache.size');
		// Construct embeds
		let shemb = new MessageEmbed()
			.setAuthor({ name: `${interaction.client.user.username}`, iconURL: `${interaction.client.user.avatarURL()}` })
			.setColor('#01fff7');
		// For loop for shards
        for (let i = 0; i < shards.length; i++) {
			// Adds an inline field to the embed with the Shard int and how many guilds it's in.
            shemb = shemb.addField(`Shard ${i} has`, `${shards[i]} guilds.\n`, true);
        }
		// Return embed
        return interaction.reply({ embeds: [shemb], ephemeral: true });
	},
};
