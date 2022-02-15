const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { objToString, randomColor } = require('../functions');
const client = require('nekos.life');
const neko = new client();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slap')
		.setDescription("Slaps the pinged member.")
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('member');
        const img = objToString(await neko.sfw.slap());
        let slapemb = new MessageEmbed()
            .setColor(`${randomColor()}`)
            .setImage(img);
		if (user != interaction.user) {
            slapemb = slapemb.setTitle(`${interaction.user.username} slaps ${user.username}`);
		} else {
            slapemb = slapemb.setTitle(`${interaction.user.username} slaps themselves`);
		}
        await interaction.reply({ embeds: [slapemb] });
	},
};
