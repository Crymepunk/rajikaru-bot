const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { objToString, randomColor } = require('../functions');
const client = require('nekos.life');
const neko = new client();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pat')
		.setDescription("Pats the pinged member.")
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('member');
        const img = objToString(await neko.sfw.pat());
        let patemb = new MessageEmbed()
            .setColor(`${randomColor()}`)
            .setImage(img);
		if (user != interaction.user) {
            patemb = patemb.setTitle(`${interaction.user.username} pats ${user.username}`);
		} else {
            patemb = patemb.setTitle(`${interaction.user.username} pats themselves`);
		}
        await interaction.reply({ embeds: [patemb] });
	},
};
