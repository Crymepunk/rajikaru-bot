const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const randomColor = () => {
    let color = '';
    for (let i = 0; i < 6; i++) {
       const random = Math.random();
       const bit = (random * 16) | 0;
       color += (bit).toString(16);
    }
    return color;
 };

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription("Replies with the user's avatar")
        .addUserOption(option => option.setName('member').setDescription('Select a user')),
	async execute(interaction) {
		const user = interaction.options.getUser('member');
		if (user) {
            const aviemb = new MessageEmbed()
            .setTitle(`${user.username}'s avatar`)
            .setColor(`${randomColor()}`)
			.setImage(`${user.avatarURL()}?size=1024`);
            interaction.reply({ embeds: [aviemb] });
		} else {
            const aviemb = new MessageEmbed()
            .setTitle(`${interaction.user.username}'s avatar`)
            .setColor(`${randomColor()}`)
			.setImage(`${interaction.user.avatarURL()}?size=1024`);
            interaction.reply({ embeds: [aviemb] });
		}
	},
};
