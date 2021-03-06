const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { errembed } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('View a list of commands')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Which category to show')
                .addChoice('All Commands', 'all')
                .addChoice('Utility commands', 'utility')
                .addChoice('Manager Commands', 'manager')
                .addChoice('Moderation Commands', 'moderation')
                .addChoice('Fun Commands', 'fun')),
	async execute(interaction) {
        // Assign variables
        let category;
        if (interaction.options.getString('category')) {
            category = interaction.options.getString('category');
        } else {
            category = 'all';
        }

        // Construct embeds
        const utilemb = new MessageEmbed()
        .setColor('#7ff520')
        .setTitle('Utility Commands')
        .setDescription('Here are the commands in the **Utility** category')
        .addFields(
            { name: '/help', value: `- View a list of commands` },
            { name: '/avatar', value: `- Replies with the user's avatar` },
            { name: '/userinfo', value: '- Replies with users info.' },
            { name: '/serverinfo', value: '- Replies with server info.' },
            { name: '/ping', value: '- Replies with Pong!' },
        )
        .setFooter({ text: `Rajikaru Dev Branch | Made by the Crymepunk Team\nCommand requested by ${interaction.user.tag} | ${interaction.user.id}` });

        const manemb = new MessageEmbed()
        .setColor('#8C56AB')
        .setTitle('Manager Commands')
        .setDescription('Here are the commands in the **Manager** category')
        .addFields(
            { name: '/settings', value: '<:uparrow:951323368064442398> **modrole** - Set a moderator role.\n' +
            '<:uparrow:951323368064442398> **manrole** - Set a manager role.\n' +
            '<:uparrow:951323368064442398> **mutedrole** - Set a custom muted role.\n' +
            '<:uparrow:951323368064442398> **maxinfractions** - Set max allowed infractions.\n' +
            '<:uparrow:951323368064442398> **commands** - Enable/Disable commands.\n' +
            '<:uparrow:951323368064442398> **list** - List all server settings.' },
            { name: '/role', value: '- Adds role to the pinged user.' },
        )
        .setFooter({ text: `Rajikaru Dev Branch | Made by the Crymepunk Team\nCommand requested by ${interaction.user.tag} | ${interaction.user.id}` });

        const modemb = new MessageEmbed()
        .setColor('#5B92E5')
        .setTitle('Moderation Commands')
        .setDescription('Here are the commands in the **Moderation** category')
        .addFields(
            { name: '/ban', value: '- Bans the pinged member.' },
            { name: '/unban', value: '- Unbans the specified user.' },
            { name: '/kick', value: '- Kicks the pinged member.' },
            { name: '/mute', value: '- Mutes the pinged member.' },
            { name: '/unmute', value: '- Unmutes the pinged member.' },
            { name: '/warn', value: 'Warns the pinged member.' },
            { name: '/infractions', value: 'Show, clear or remove infractions from a member.' },
            { name: '/purge', value: '- Removes messages.' },
            { name: '/nick', value: '- Give a nickname to the mentioned user.' },
            { name: '/say', value: '- Says the message you tell it to say.' },
        )
        .setFooter({ text: `Rajikaru Dev Branch | Made by the Crymepunk Team\nCommand requested by ${interaction.user.tag} | ${interaction.user.id}` });

        const funemb = new MessageEmbed()
        .setColor('#f57ae0')
        .setTitle('Fun Commands')
        .setDescription('Here are the commands in the **Fun** category')
        .addFields(
            { name: '/cuddle', value: '- Cuddles the pinged member.' },
            { name: '/hug', value: '- Hugs the pinged member.' },
            { name: '/pat', value: '- Pats the pinged member.' },
            { name: '/slap', value: '- Slaps the pinged member.' },
            { name: '/neko', value: '- Sends a random catperson image.' },
            { name: '/coinflip', value: '- Replies with Heads or Tails.' },
            { name: '/8ball', value: `- Answer's your questions for you.` },
            { name: '/owoify', value: '- Owoifies your text.' },
            { name: '/gayrate', value: '-  How gay is the pinged person (Random)' },
        )
        .setFooter({ text: `Rajikaru Dev Branch | Made by the Crymepunk Team\nCommand requested by ${interaction.user.tag} | ${interaction.user.id}` });

        // Check category
        switch (category.toLowerCase()) {
            case 'all':
                if (interaction.inGuild()) {
                    await interaction.reply('Check your DMs for a full list of commands!');
                    return interaction.user.send({ embeds: [utilemb, manemb, modemb, funemb] });
                // If the command was in DM's just send the help output
                } else {
                    return interaction.reply({ embeds: [utilemb, manemb, modemb, funemb] });
                }
            case 'utility':
                return interaction.reply({ embeds: [utilemb] });
            case 'manager':
                return interaction.reply({ embeds: [manemb] });
            case 'moderation':
                return interaction.reply({ embeds: [modemb] });
            case 'fun':
                return interaction.reply({ embeds: [funemb] });
            default:
                return errembed({ interaction: interaction, author: 'Valid categories include: All, Utility, Manager, Moderation and Fun' });
        }
	},
};
