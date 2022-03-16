const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { objToString, randomColor } = require('../../functions');
const client = require('nekos.life');
const neko = new client();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slap')
		.setDescription("Slaps the pinged member.")
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true)),
	async execute(interaction) {
		// Assign variables
		const user = interaction.options.getUser('member');
        // Get image from nekos.life
		const img = objToString(await neko.sfw.slap());
		// Construct embed
        let slapemb = new MessageEmbed()
            .setColor(`${randomColor()}`)
            .setImage(img);
		// Check if user is sender
		if (user != interaction.user) {
            slapemb = slapemb.setTitle(`${interaction.user.username} slaps ${user.username}`);
		} else {
            slapemb = slapemb.setTitle(`${interaction.user.username} slaps themselves`);
		}

		// Return embed
        return interaction.reply({ embeds: [slapemb] });
	},
};
