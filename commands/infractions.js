const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { userTable, randomColor } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('infractions')
		.setDescription('How many infractions the user has and what they are.')
        .addUserOption(option => option.setName('user').setDescription('User to check.').setRequired(true)),
	async execute(interaction) {
        const user = interaction.options.getUser('user');
        const tableName = `${interaction.guild.id}-${user.id}`;
        const usertable = await userTable.findOne({ where: { name: tableName } });
        if (interaction.guild == null) {
            return interaction.reply('This command only works in Guilds!');
        } else if (usertable) {
            console.log(usertable.get('infractions'));
            let infractions = usertable.get('infractions');
            infractions = infractions.split('§');
            let inf = '';
            if (infractions.length >= 9) {
                inf = (
                    infractions[-10] + '\n'
                    + infractions[-9] + '\n'
                    + infractions[-8] + '\n'
                    + infractions[-7] + '\n'
                    + infractions[-6] + '\n'
                    + infractions[-5] + '\n'
                    + infractions[-4] + '\n'
                    + infractions[-3] + '\n'
                    + infractions[-2] + '\n'
                    + infractions[-1] + '\n'
                );
            } else if (infractions.length == 8) {
                inf = (
                    infractions[-9] + '\n'
                    + infractions[-8] + '\n'
                    + infractions[-7] + '\n'
                    + infractions[-6] + '\n'
                    + infractions[-5] + '\n'
                    + infractions[-4] + '\n'
                    + infractions[-3] + '\n'
                    + infractions[-2] + '\n'
                    + infractions[-1] + '\n'
                );
            } else if (infractions.length == 7) {
                inf = (
                    infractions[-8] + '\n'
                    + infractions[-7] + '\n'
                    + infractions[-6] + '\n'
                    + infractions[-5] + '\n'
                    + infractions[-4] + '\n'
                    + infractions[-3] + '\n'
                    + infractions[-2] + '\n'
                    + infractions[-1] + '\n'
                );
            } else if (infractions.length == 6) {
                inf = (
                    infractions[-7] + '\n'
                    + infractions[-6] + '\n'
                    + infractions[-5] + '\n'
                    + infractions[-4] + '\n'
                    + infractions[-3] + '\n'
                    + infractions[-2] + '\n'
                    + infractions[-1] + '\n'
                );
            } else if (infractions.length == 5) {
                inf = (
                    infractions[-6] + '\n'
                    + infractions[-5] + '\n'
                    + infractions[-4] + '\n'
                    + infractions[-3] + '\n'
                    + infractions[-2] + '\n'
                    + infractions[-1] + '\n'
                );
            } else if (infractions.length == 4) {
                inf = (
                    infractions[-5] + '\n'
                    + infractions[-4] + '\n'
                    + infractions[-3] + '\n'
                    + infractions[-2] + '\n'
                    + infractions[-1] + '\n'
                );
            } else if (infractions.length == 3) {
                inf = (
                    infractions[-4] + '\n'
                    + infractions[-3] + '\n'
                    + infractions[-2] + '\n'
                    + infractions[-1] + '\n'
                );
            } else if (infractions.length == 2) {
                inf = (
                    infractions[-3] + '\n'
                    + infractions[-2] + '\n'
                    + infractions[-1] + '\n'
                );
            } else if (infractions.length == 1) {
                inf = (
                    infractions[-2] + '\n'
                    + infractions[-1] + '\n'
                );
            } else {
                inf = (infractions[0] + '\n');
            }

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
