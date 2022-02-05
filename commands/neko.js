const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { objToString, randomColor } = require('../functions');
const client = require('nekos.life');
const neko = new client();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('neko')
		.setDescription("Sends a random catperson image.")
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('member');
		if (user != interaction.user) {
            const img = objToString(await neko.sfw.neko());
            const nekoemb = new MessageEmbed()
                .setTitle(`${interaction.user.username} cuddles ${user.username}`)
                .setColor(`${randomColor()}`)
				.setImage(img);
            await interaction.reply({ embeds: [nekoemb] });
		} else {
            const img = objToString(await neko.sfw.neko());
            const nekoemb = new MessageEmbed()
                .setTitle(`${interaction.user.username} cuddles themselves`)
                .setColor(`${randomColor()}`)
				.setImage(img);
            await interaction.reply({ embeds: [nekoemb] });
			}
	},
};
