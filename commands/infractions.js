const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { userTables, randomColor } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('infractions')
		.setDescription('How many infractions the user has and what they are.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List the users infractions')
                .addUserOption(option => option.setName('user').setDescription('User to check.').setRequired(true)))
        .addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove an infraction.')
				.addUserOption(option => option.setName('user').setDescription('User to remove from').setRequired(true))
                .addIntegerOption(option => option.setName('infractionnum').setDescription('Which infraction to remove').setRequired(true))),
	async execute(interaction) {
        const user = interaction.options.getUser('user');
        const tableName = `${interaction.guild.id}-${user.id}`;
        const usertable = await userTables.findOne({ where: { name: tableName } });
        if (interaction.guild == null) {
            return interaction.reply('This command only works in Guilds!');
        } else if (usertable) {
            let infractions = usertable.get('infractions');
            if (infractions != null) {
                infractions = infractions.split('§');
                if (interaction.options.getSubcommand() === 'remove') {
                    if (infractions.length > 1) {
                        const int = interaction.options.getInteger('infractionnum');
                        delete infractions[int - 1];
                        infractions = infractions.filter(el => {
                            return el != null;
                        });
                    } else {
                        infractions = null;
                    }
                    await userTables.update({ infractions: infractions }, { where: { name: tableName } });
                } else if (interaction.options.getSubcommand() === 'list') {
                    let inf = '';
                    console.log(infractions[-1]);
                    if (infractions[-2]) {inf += (infractions[-2] + '\n');}
                    if (infractions[-1]) {inf += (infractions[-1] + '\n');}
                    if (infractions[0]) {inf += (infractions[0]);}
                    else {return interaction.reply('This user doesnt have any infractions apparently but its wrong and i hate it');}
                    const infemb = new MessageEmbed()
                        .setColor(randomColor())
                        .setTitle(`${user.username}'s infractions`)
                        .addFields(
                            { name: 'Infractions', value: inf },
                        )
                        .setThumbnail(`${user.avatarURL()}?size=1024`);
                    interaction.reply({ embeds: [infemb] });
                }
            } else {
                const infemb = new MessageEmbed()
                    .setColor(randomColor())
                    .setAuthor({ name: `**${user.tag} has no infractions**`, iconURL: `${user.avatarURL()}?size=1024` });
                return interaction.reply({ embeds: [infemb] });
            }
        } else {
            const infemb = new MessageEmbed()
                .setColor(randomColor())
                .setAuthor({ name: `**${user.tag} has no infractions**`, iconURL: `${user.avatarURL()}?size=1024` });
            return interaction.reply({ embeds: [infemb] });
        }
	},
};

