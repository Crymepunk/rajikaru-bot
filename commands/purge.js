const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Removes messages.')
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of messages to delete.').setRequired(true)),
	async execute(interaction) {
        const limit = interaction.options.getInteger('amount');
        if (interaction.guild == null) {
            await interaction.reply('This command only works in Guilds!');
        } else if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            if (interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                await interaction.channel.bulkDelete(limit);
                await interaction.reply(`Chat purged by ${interaction.user}`);
            } else {
                const puremb = new MessageEmbed()
                    .setColor("#CC0000")
                    .setAuthor({ name: `I am missing the Manage Messages permission.` });
                await interaction.reply({ embeds: [puremb], ephemeral: true });
            }
        } else {
            const puremb = new MessageEmbed()
                .setColor("#CC0000")
                .setAuthor({ name: `You are missing the Manage Messages permission.` });
            await interaction.reply({ embeds: [puremb], ephemeral: true });
        }
	},
};
