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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

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
            interaction.reply({ embeds: [gayemb] });
		} else {
            const gayemb = new MessageEmbed()
                .setTitle(`Gayness Percentage`)
                .setColor(`${randomColor()}`)
                .setDescription(`${user.displayName} is ${getRandomIntInclusive(0, 101)}% gay`);
            interaction.reply({ embeds: [gayemb] });
		}
	},
};
