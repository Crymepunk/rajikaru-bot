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
                .addIntegerOption(option => option.setName('infractionnum').setDescription('Which infraction to remove').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription('Clears ALL infractions!!!'))
                .addUserOption(option => option.setName('user').setDescription('User to clear').setRequired(true)),
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
                    const int = interaction.options.getInteger('infractionnum');
                    if (infractions.length > 1) {
                        delete infractions[int - 1];
                        infractions = infractions.filter(el => {
                            return el != null;
                        });
                        infractions = infractions.join('§');
                    } else {
                        infractions = null;
                    }
                    await userTables.update({ infractions: infractions }, { where: { name: tableName } });
                    await interaction.reply({ content: `Removed infraction number '${int}'.`, ephemeral: true });
                } else if (interaction.options.getSubcommand() === 'clear') {
                    infractions = null;
                    await userTables.update({ infractions: infractions }, { where: { name: tableName } });
                    await interaction.reply({ content: `Removed all infractions.`, ephemeral: true });
                } else if (interaction.options.getSubcommand() === 'list') {
                    let inf = '';
                    if (infractions[0]) {inf += `${infractions.length} - ${infractions.slice(-1)} \n`;}
                    else {return interaction.reply('This user doesnt have any infractions apparently but its wrong and i hate it');}
                    if (infractions[1]) {inf += `${infractions.slice(-2, -1)} \n`;}
                    if (infractions[2]) {inf += `${infractions.slice(-3, -2)} \n`;}
                    if (infractions[3]) {inf += `${infractions.slice(-4, -3)} \n`;}
                    if (infractions[4]) {inf += `${infractions.slice(-5, -4)} \n`;}
                    if (infractions[5]) {inf += `${infractions.slice(-6, -5)} \n`;}
                    if (infractions[6]) {inf += `${infractions.slice(-7, -6)} \n`;}
                    if (infractions[7]) {inf += `${infractions.slice(-8, -7)} \n`;}
                    if (infractions[8]) {inf += `${infractions.slice(-9, -8)} \n`;}
                    if (infractions[9]) {inf += `${infractions.slice(-10, -9)}`;}
                    const infemb = new MessageEmbed()
                        .setColor(randomColor())
                        .setTitle(`${user.username}'s infractions`)
                        .addFields(
                            { name: 'Total', value: infractions.length },
                            { name: 'Last 10 infractions', value: inf },
                        )
                        .setThumbnail(`${user.avatarURL()}?size=1024`);
                    interaction.reply({ embeds: [infemb] });
                }
            } else {
                const infemb = new MessageEmbed()
                    .setColor(randomColor())
                    .setAuthor({ name: `${user.tag} has no infractions`, iconURL: `${user.avatarURL()}?size=1024` });
                return interaction.reply({ embeds: [infemb] });
            }
        } else {
            const infemb = new MessageEmbed()
                .setColor(randomColor())
                .setAuthor({ name: `${user.tag} has no infractions`, iconURL: `${user.avatarURL()}?size=1024` });
            return interaction.reply({ embeds: [infemb] });
        }
	},
};

