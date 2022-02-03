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
		.setName('help')
		.setDescription('Shows this message.')
        .addStringOption(option => option.setName('category').setDescription('Which category to show')),
	async execute(interaction) {
        const category = interaction.options.getString('category');
        if (!category || category.toLowerCase() == 'all') {
            const helpemb = new MessageEmbed()
                .setColor(randomColor())
                .setTitle('Rajikaru Bot - Commands')
                .setDescription('Here are all the commands and what they do.                     ')
                .addFields(
                    { name: '\u200B', value: '**Base Commands**' },
                    { name: '/pull', value: '- Pulls the latest version from github.' },
                    { name: '/restart', value: '- Restarts the bot.' },

                    { name: '\u200B', value: '**Utility Commands**' },
                    { name: '/avatar', value: `- Replies with the user's avatar` },
                    { name: '/nick', value: '- Give a nickname to the mentioned user.' },
                    { name: '/say', value: '- Says the message you tell it to say.' },
                    { name: '/role', value: '- Adds role to the pinged user. (TBS)' },
                    { name: '/serverinfo', value: '- Shows server information. (WIP)' },
                    { name: '/userinfo', value: '- Shows member information. (WIP)' },
                    { name: '/ping', value: '- Replies with Pong!' },

                    { name: '\u200B', value: '**Moderation Commands**' },
                    { name: '/ban', value: '- Bans the pinged member.' },
                    { name: '/kick', value: '- Kicks the pinged member.' },
                    { name: '/mute', value: '- Mutes the pinged member. (TBS)' },
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
                interaction.reply('Check your DMs for a full list of commands!');
                interaction.user.send({ embeds: [helpemb] });
            } else {
                interaction.reply({ embeds: [helpemb] });
            }
        } else
        if (category.toLowerCase() == 'base') {
            const helpemb = new MessageEmbed()
                .setColor(randomColor())
                .setTitle('Base Commands')
                .setDescription('Here are the commands in the **Base** category')
                .addFields(
                    { name: '/pull', value: '- Pulls the latest version from github.' },
                    { name: '/restart', value: '- Restarts the bot.' },
                );
            interaction.reply({ embeds: [helpemb] });
        } else if (category.toLowerCase() == 'utility') {
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
            interaction.reply({ embeds: [helpemb] });
        } else if (category.toLowerCase() == 'moderation') {
            const helpemb = new MessageEmbed()
                .setColor(randomColor())
                .setTitle('Moderation Commands')
                .setDescription('Here are the commands in the **Moderation** category')
                .addFields(
                    { name: '/ban', value: '- Bans the pinged member.' },
                    { name: '/kick', value: '- Kicks the pinged member.' },
                    { name: '/mute', value: '- Mutes the pinged member. (TBS)' },
                    { name: '/purge', value: '- Removes messages.' },
                );
            interaction.reply({ embeds: [helpemb] });
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
            interaction.reply({ embeds: [helpemb] });
        } else {
            interaction.reply({ content: 'Valid categories include: Base, Fun, Utility and Moderation', ephemeral: true });
        }
	},
};
