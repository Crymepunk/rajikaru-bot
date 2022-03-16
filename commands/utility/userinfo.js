const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const { errembed, userTables, guildTables } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Replies with users info.')
        .addUserOption(option => option.setName('member').setDescription('Member to show info for.').setRequired(true)),
	async execute(interaction) {
        // Check for guild
        if (!interaction.guild) {
            // Error if no guild
            return errembed({ interaction: interaction, author: `This command only works in Guilds!` });
        }
        // Assign variables
        const member = interaction.options.getMember('member');
        const owner = await interaction.guild.fetchOwner();
        let status;
        const userTableName = `${interaction.guild.id}-${member.user.id}`;
        const usertable = await userTables.findOne({ where: { name: userTableName } });
        const guildTableName = String(interaction.guild.id + '-guild');
        const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
        let modrole; let manrole;
        if (guildtable) {
            modrole = await guildtable.get('modrole');
            manrole = await guildtable.get('manrole');
        }
        // Get infractions from usertable
        let infractions;
        if (usertable) {
            infractions = usertable.get('infractions');
        } else {
            infractions = null;
        }
        if (infractions) {
            infractions = infractions.split('§');
            infractions = infractions.length;
        } else {
            infractions = `None`;
        }

        // Set "Server Status" by checking permissions
        if (member == owner) {
            status = `Server Owner,\nServer Administrator,\nServer Moderator`;
        } else if (member._roles.includes(manrole) || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            status = `Server Administrator,\nServer Moderator`;
        } else if (member._roles.includes(modrole) || member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            status = `Server Moderator`;
        } else {
            status = `None`;
        }

        // Get perms
        let perms;
        // Set perms to "Administrator" if they have all (done to not fill chat)
        if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            perms = `Administrator`;
        } else {
            // Else get the permissions and make them lowercase (upper by default)
            perms = member.permissions.toArray();
            perms = perms.map(perm => perm.toLowerCase());
        }

        // Get boosting status
        let boosting;
        if (member.premiumSince != null) {
            boosting = `<t:${Math.floor(member.premiumSince / 1000)}>`;
        } else {
            boosting = `Not Boosting`;
        }

        // Construct embed
        const emb = new MessageEmbed()
        .setColor("#7ff520")
        .setThumbnail(`${member.user.avatarURL()}?size=1024`)
        .addFields(
            { name: `Userinfo command for ${member.user.tag}`, value: `UserID | ${member.user.id}`, inline: true },
            { name: `Server Permissions`, value: `${perms}`, inline: true },
            { name: `User Status`, value: status, inline: true },
            { name: `Server Infractions`, value: `${infractions}`, inline: true },
            { name: `Joined Server at`, value: `<t:${Math.floor(member.joinedAt / 1000)}>`, inline: true },
            { name: `Joined Discord at`, value: `<t:${Math.floor(member.user.createdAt / 1000)}>`, inline: true },
            { name: `Boosting Since`, value: `${boosting}` },
        )
        .setFooter({ text: `Requested by ${interaction.user.tag} | ${interaction.user.id}` });

        // Send embed
        return interaction.reply({ embeds: [emb] });
	},
};