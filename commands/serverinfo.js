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
		.setName('serverinfo')
		.setDescription('Shows member information.'),
	async execute(interaction) {
        const siemb = new MessageEmbed()
            .setColor(`${randomColor()}`)
            .setFields(
                { name: 'Owner\n', value: `${await interaction.guild.fetchOwner()}`, inline: true },
            );
        interaction.reply({ embeds: [siemb] });
	},
};
