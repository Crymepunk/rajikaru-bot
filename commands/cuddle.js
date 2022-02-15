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
        const img = objToString(await neko.sfw.cuddle());
        let cudlemb = new MessageEmbed()
            .setColor(`${randomColor()}`)
            .setImage(img);
		if (user != interaction.user) {
            cudlemb = cudlemb.setTitle(`${interaction.user.username} cuddles ${user.username}`);
		} else {
            cudlemb = cudlemb.setTitle(`${interaction.user.username} cuddles themselves`);
		}
        await interaction.reply({ embeds: [cudlemb] });
	},
};
