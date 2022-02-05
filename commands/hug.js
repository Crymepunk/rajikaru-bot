const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { objToString, randomColor } = require('../functions');
const client = require('nekos.life');
const neko = new client();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hug')
		.setDescription("Hugs the pinged member.")
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('member');
		if (user != interaction.user) {
            const img = objToString(await neko.sfw.hug());
            const hugemb = new MessageEmbed()
                .setTitle(`${interaction.user.username} hugs ${user.username}`)
                .setColor(`${randomColor()}`)
				.setImage(img);
            await interaction.reply({ embeds: [hugemb] });
		} else {
            const img = objToString(await neko.sfw.hug());
            const hugemb = new MessageEmbed()
                .setTitle(`${interaction.user.username} hugs themselves`)
                .setColor(`${randomColor()}`)
				.setImage(img);
            await interaction.reply({ embeds: [hugemb] });
			}
	},
};
