const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { userTables, randomColor } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('infractions')
		.setDescription('How many infractions the user has and what they are.')
        .addUserOption(option => option.setName('user').setDescription('User to check.').setRequired(true)),
	async execute(interaction) {
        const user = interaction.options.getUser('user');
        const tableName = `${interaction.guild.id}-${user.id}`;
        const usertable = await userTables.findOne({ where: { name: tableName } });
        if (interaction.guild == null) {
            return interaction.reply('This command only works in Guilds!');
        } else if (usertable) {
            console.log(usertable.get('infractions'));
            let infractions = usertable.get('infractions');
            infractions = infractions.split('§');
            let inf = '';
            if (infractions[-3]) {inf += (infractions[-3] + '\n');}
            if (infractions[-2]) {inf += (infractions[-2] + '\n');}
            if (infractions[-1]) {inf += (infractions[-1]);}
            const infemb = new MessageEmbed()
            .setColor(randomColor())
            .setTitle(`${user.username}'s infractions`)
            .addFields(
                { name: 'Infractions', value: inf },
            )
            .setThumbnail('https://i.imgur.com/AfFp7pu.png');
            interaction.reply({ embeds: [infemb] });
        } else {
            interaction.reply('This user doesnt exist/doesnt have any infractions.');
        }

	},
};
