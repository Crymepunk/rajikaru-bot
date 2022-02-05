const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { randomColor, objToString } = require('../functions');
const client = require('nekos.life');
const neko = new client();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cuddle')
		.setDescription("Cuddles the pinged member.")
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('member');
		if (user != interaction.user) {
            const img = objToString(await neko.sfw.cuddle());
            const cudlemb = new MessageEmbed()
                .setTitle(`${interaction.user.username} cuddles ${user.username}`)
                .setColor(`${randomColor()}`)
				.setImage(img);
            await interaction.reply({ embeds: [cudlemb] });
		} else {
            const img = objToString(await neko.sfw.cuddle());
            const cudlemb = new MessageEmbed()
                .setTitle(`${interaction.user.username} cuddles themselves`)
                .setColor(`${randomColor()}`)
				.setImage(img);
            interaction.reply({ embeds: [cudlemb] });
			}
	},
};
