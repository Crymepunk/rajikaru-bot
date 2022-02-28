const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { objToString, randomColor } = require('../../functions');
const client = require('nekos.life');
const neko = new client();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('neko')
		.setDescription("Sends a random catperson image."),
	async execute(interaction) {
        // Get image from nekos.life
        const img = objToString(await neko.sfw.neko());
        // Construct embed
        const nekoemb = new MessageEmbed()
            .setColor(`${randomColor()}`)
            .setImage(img);
        // Reply with embed
        await interaction.reply({ embeds: [nekoemb] });
	},
};
