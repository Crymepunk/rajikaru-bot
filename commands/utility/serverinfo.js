const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { errembed } = require('../../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Replies with server info.'),
        // Builds the slash command
	async execute(interaction) {
        // Check if interaction is in guild
        if (!interaction.guild) {
            // Return errembed if not
            return errembed({ interaction: interaction, author: 'This command only works in Guilds!' });
        }
        // Assign variables
        let vc = 0; let tc = 0;
        let cc = 0; const channels = await interaction.guild.channels.fetch();
        for (let i = 0; i < channels.size; i++) {
            const channel = channels.at(i);
            if (channel.isText()) {
                tc += 1;
            } else if (channel.isVoice()) {
                vc += 1;
            } else if (!channel.isThread()) {
                cc += 1;
            }
        }
        if (vc == 0) vc = "None";
        if (tc == 0) tc = "None";
        if (cc == 0) cc = "None";
        let boosts; let boosttext;
        if (interaction.guild.premiumSubscriptionCount == 0) {
            boosttext = `<:boost_grey:952568685648818268> Boost Status`;
            boosts =
                `Count: 0\n` +
                `Tier: 0/3`;
        } else if (interaction.guild.premiumSubscriptionCount == 1) {
            boosttext = `<:boost:952522274819407912> Boost Status`;
            boosts =
                `Count: 1\n` +
                `Tier: 0/3`;
        } else {
            boosttext = `<:boost:952522274819407912> Boost Status`;
            boosts =
                `Count: ${interaction.guild.premiumSubscriptionCount}\n` +
                `Tier: ${interaction.guild.premiumTier.slice(5)}/3`;
        }
        const icon = await interaction.guild.iconURL();
        const owner = await interaction.guild.fetchOwner();
        const sername = interaction.guild.name.toString();
        let verified; let verifiedtext;
        if (interaction.guild.verified) {
            verifiedtext = `<:verified:952504138862829618> Verified`;
            verified = "True";
        } else {
            verifiedtext = `<:gcverified:952525107128061962> Verified`;
            verified = "False";
        }
        let roles; await interaction.guild.roles.fetch().then(role => roles = role.size);
        // Construct embed
        const infoemb = new MessageEmbed()
            .setColor("#7ff520")
            .setThumbnail(icon)
            .setAuthor({ name: sername, iconURL: icon })
            .addFields(
                { name: `<:owner:952522274970423326> Owner`, value: `${owner.user.tag}`, inline: true },
                { name: `<:members:952527373029474324> Members`, value: `${await interaction.guild.memberCount}`, inline: true },
                { name: `<:role:952522274706178088> Roles`, value: `${roles}`, inline: true },
                { name: `<:category:952522692135899156> Category Channels`, value: `${cc}`, inline: true },
                { name: `<:voice:952522274932686848> Voice Channels`, value: `${vc}`, inline: true },
                { name: `<:channel:952522274643275776> Text Channels`, value: `${tc}`, inline: true },
                { name: boosttext, value: boosts, inline: true },
                { name: verifiedtext, value: verified, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true },
            );
        // Return embed
        return interaction.reply({ embeds: [infoemb], ephemeral: false });
    },
};
