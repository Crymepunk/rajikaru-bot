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
        // Assign variables
		const user = interaction.options.getUser('member');
        // Get image from nekos.life
        const img = objToString(await neko.sfw.hug());
        // Construct embed
        let hugemb = new MessageEmbed()
            .setColor(`${randomColor()}`)
            .setImage(img);
        // Check if user is sender or not.
		if (user != interaction.user) {
            hugemb = hugemb.setTitle(`${interaction.user.username} hugs ${user.username}`);
		} else {
            hugemb = hugemb.setTitle(`${interaction.user.username} hugs themselves`);
        }
        // Reply with embed
        await interaction.reply({ embeds: [hugemb] });
	},
};
