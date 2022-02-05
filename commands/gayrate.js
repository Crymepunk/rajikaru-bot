const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getRandomIntInclusive, randomColor } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gayrate')
		.setDescription("How gay is the pinged person O_o")
        .addUserOption(option => option.setName('member').setDescription('Select a user')),
	async execute(interaction) {
		const user = interaction.options.getMember('member');
		if (!user) {
            const gayemb = new MessageEmbed()
                .setTitle(`Gayness Percentage`)
                .setColor(`${randomColor()}`)
                .setDescription(`You are ${getRandomIntInclusive(0, 101)}% gay`);
            await interaction.reply({ embeds: [gayemb] });
		} else {
            const gayemb = new MessageEmbed()
                .setTitle(`Gayness Percentage`)
                .setColor(`${randomColor()}`)
                .setDescription(`${user.displayName} is ${getRandomIntInclusive(0, 101)}% gay`);
            await interaction.reply({ embeds: [gayemb] });
		}
	},
};
