const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { errembed, permcheck } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nick')
		.setDescription("Give a nickname to the mentioned user.")
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('nick').setDescription('New Nickname').setRequired(true)),
	async execute(interaction) {
        if (!interaction.guild) {
            return errembed({ interaction: interaction, author: 'This command only works in Guilds!' });
        }
        // Assign all the needed variables (Jesus there are many..)
        const member = interaction.options.getMember('member');
        const nick = interaction.options.getString('nick');
        const nickemb = new MessageEmbed()
            .setColor('#5B92E5')
            .setThumbnail(`${member.user.avatarURL()}`)
            .setAuthor({ name: `Nickname Change` })
            .addField(`Changed ${member.user.username}'s nickname to`, `${nick}`)
            .setFooter({ text: `Command requested by\n${interaction.user.tag} | ${interaction.user.id}` });

        if (await permcheck({ interaction: interaction, member: member, selfcheck: false, permflag: Permissions.FLAGS.CHANGE_NICKNAME })) {
            return;
        } else if (interaction.guild.me.permissions.has(Permissions.FLAGS.CHANGE_NICKNAME)) {
            // Check if nick is under 32 characters
            if (nick.length <= 32) {
                await interaction.reply({ embeds: [nickemb] });
                // Actual nickname change
                member.edit({ nick: nick });
            // Else send a message about the nickname being too long
            } else {
                await errembed({ interaction: interaction, author: 'This nickname is too long!' });
            }
        // If the bot is missing permissions post this
        } else {
            return errembed({ interaction: interaction, author: `I am missing the Change Nickname permission` });
        }
    },
};
