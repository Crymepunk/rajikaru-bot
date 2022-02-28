const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { errembed } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('View a list of commands')
        .addStringOption(option => option.setName('category').setDescription('Which category to show')),
	async execute(interaction) {
        // Assign variables
        const category = interaction.options.getString('category');

        // Construct embeds
        const utilemb = new MessageEmbed()
        .setColor('#7ff520')
        .setTitle('Utility Commands')
        .setDescription('Here are the commands in the **Utility** category')
        .addFields(
            { name: '/help', value: `- View a list of commands` },
            { name: '/avatar', value: `- Replies with the user's avatar` },
            { name: '/nick', value: '- Give a nickname to the mentioned user.' },
            { name: '/userinfo', value: '- Replies with users info.' },
            { name: '/serverinfo', value: '- Replies with server info.' },
            { name: '/ping', value: '- Replies with Pong!' },
        )
        .setFooter({ text: "Rajikaru Main Branch | Made by the Crymepunk Team" });

        const manemb = new MessageEmbed()
        .setColor('#d00202')
        .setTitle('Manager Commands')
        .setDescription('Here are the commands in the **Manager** category')
        .addFields(
            { name: '/settings', value: '- Bot Settings.' },
            { name: '/role', value: '- Adds role to the pinged user.' },
        )
        .setFooter({ text: "Rajikaru Main Branch | Made by the Crymepunk Team" });

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
            { name: '/say', value: '- Says the message you tell it to say.' },
        )
        .setFooter({ text: "Rajikaru Main Branch | Made by the Crymepunk Team" });

        const funemb = new MessageEmbed()
        .setColor('#f57ae0')
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
        )
        .setFooter({ text: "Rajikaru Main Branch | Made by the Crymepunk Team" });

        // Check category
        if (!category || category.toLowerCase() == 'all') {
            // If the category is all and the command was in a guild, send a response and DM the help output
            if (interaction.inGuild()) {
                await interaction.reply('Check your DMs for a full list of commands!');
                interaction.user.send({ embeds: [utilemb, manemb, modemb, funemb] });
            // If the command was in DM's just send the help output
            } else {
                await interaction.reply({ embeds: [utilemb, manemb, modemb, funemb] });
            }
        } else if (category.toLowerCase() == 'utility') {
            await interaction.reply({ embeds: [utilemb] });
        } else if (category.toLowerCase() == 'manager') {
        await interaction.reply({ embeds: [manemb] });
        } else if (category.toLowerCase() == 'moderation') {
            await interaction.reply({ embeds: [modemb] });
        } else if (category.toLowerCase() == 'fun') {
            await interaction.reply({ embeds: [funemb] });
        // Return errembed if no valid category was provided
        } else {
            return errembed({ interaction: interaction, author: 'Valid categories include: All, Utility, Manager, Moderation and Fun' });
        }
	},
};
