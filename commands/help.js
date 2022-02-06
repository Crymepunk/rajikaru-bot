const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { randomColor } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('View a list of commands')
        .addStringOption(option => option.setName('category').setDescription('Which category to show').addChoice('all').addChoice('utility').addChoice('manager').addChoice('moderation').addChoice('fun')),
	async execute(interaction) {
        const category = interaction.options.getString('category');
        if (!category || category.toLowerCase() == 'all') {
            const helpemb = new MessageEmbed()
                .setColor(randomColor())
                .setTitle('Rajikaru Bot - Commands')
                .setDescription('Here are all the commands and what they do.                     ')
                .addFields(
                    { name: '\u200B', value: '**Utility Commands**' },
                    { name: '/avatar', value: `- Replies with the user's avatar` },
                    { name: '/nick', value: '- Give a nickname to the mentioned user.' },
                    { name: '/say', value: '- Says the message you tell it to say.' },
                    { name: '/role', value: '- Adds role to the pinged user.' },
                    { name: '/ping', value: '- Replies with Pong!' },

                    { name: '\u200B', value: '**Manager Commands**' },
                    { name: '/settings', value: 'Bot Settings' },

                    { name: '\u200B', value: '**Moderation Commands**' },
                    { name: '/ban', value: '- Bans the pinged member.' },
                    { name: '/kick', value: '- Kicks the pinged member.' },
                    { name: '/warn', value: '- Mutes the pinged member. (TBS)' },
                    { name: '/infractions', value: '- Mutes the pinged member. (TBS)' },
                    { name: '/purge', value: '- Removes messages.' },

                    { name: '\u200B', value: '**Fun Commands**' },
                    { name: '/cuddle', value: '- Cuddles the pinged member.' },
                    { name: '/hug', value: '- Hugs the pinged member.' },
                    { name: '/pat', value: '- Pats the pinged member.' },
                    { name: '/slap', value: '- Slaps the pinged member.' },
                    { name: '/coinflip', value: '- Replies with Heads or Tails.' },
                    { name: '/neko', value: '- Sends a random catperson image.' },
                    { name: '/owoify', value: '- Owoifies your text.' },
                    { name: '/gayrate', value: '-  How gay is the pinged person (Random)' },
                );
            if (interaction.inGuild()) {
                await interaction.reply('Check your DMs for a full list of commands!');
                interaction.user.send({ embeds: [helpemb] });
            } else {
                await interaction.reply({ embeds: [helpemb] });
            }
        } else
        if (category.toLowerCase() == 'utility') {
            const helpemb = new MessageEmbed()
                .setColor(randomColor())
                .setTitle('Utility Commands')
                .setDescription('Here are the commands in the **Utility** category')
                .addFields(
                    { name: '/avatar', value: `- Replies with the user's avatar` },
                    { name: '/nick', value: '- Give a nickname to the mentioned user.' },
                    { name: '/say', value: '- Says the message you tell it to say.' },
                    { name: '/role', value: '- Adds role to the pinged user.' },
                    { name: '/ping', value: 'Replies with Pong!' },
                );
            await interaction.reply({ embeds: [helpemb] });
        } else if (category.toLowerCase() == 'manager') {
            const helpemb = new MessageEmbed()
            .setColor(randomColor())
            .setTitle('Manager Commands')
            .setDescription('Here are the commands in the **Manager** category')
            .addFields(
                { name: '/settings', value: 'Bot Settings' },
            );
        await interaction.reply({ embeds: [helpemb] });
        } else if (category.toLowerCase() == 'moderation') {
            const helpemb = new MessageEmbed()
                .setColor(randomColor())
                .setTitle('Moderation Commands')
                .setDescription('Here are the commands in the **Moderation** category')
                .addFields(
                    { name: '/ban', value: '- Bans the pinged member.' },
                    { name: '/kick', value: '- Kicks the pinged member.' },
                    { name: '/purge', value: '- Removes messages.' },
                );
            await interaction.reply({ embeds: [helpemb] });
        } else if (category.toLowerCase() == 'fun') {
            const helpemb = new MessageEmbed()
                .setColor(randomColor())
                .setTitle('Fun Commands')
                .setDescription('Here are the commands in the **Fun** category')
                .addFields(
                    { name: '/cuddle', value: '- Cuddles the pinged member.' },
                    { name: '/hug', value: '- Hugs the pinged member.' },
                    { name: '/pat', value: '- Pats the pinged member.' },
                    { name: '/slap', value: '- Slaps the pinged member.' },
                    { name: '/coinflip', value: '- Replies with Heads or Tails.' },
                    { name: '/neko', value: '- Sends a random catperson image.' },
                    { name: '/owoify', value: '- Owoifies your text.' },
                    { name: '/gayrate', value: '-  How gay is the pinged person (Random)' },
                );
            await interaction.reply({ embeds: [helpemb] });
        } else {
            await interaction.reply({ content: 'Valid categories include: All, Utility, Manager, Moderation and Fun', ephemeral: true });
        }
	},
};
