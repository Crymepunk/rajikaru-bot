const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { userTables, guildTables, userTableCreate, guildTableCreate, permcheck, errembed } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warns the pinged member')
        .addUserOption(option => option.setName('member').setDescription('User to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for warning').setRequired(true)),
	async execute(interaction) {
        // Check for guild
        if (!interaction.guild) {
            // Error if no guild
            return errembed({ interaction: interaction, author: 'This command only works in Guilds!' });
        }
        // Assign variables
        const member = interaction.options.getMember('member');
        const user = interaction.options.getUser('member');
        const reason = `**${interaction.options.getString('reason')}** • <t:${Math.floor(new Date().getTime() / 1000)}:R>`;
        const userTableName = `${interaction.guild.id}-${user.id}`;
        const guildTableName = String(interaction.guild.id + '-guild');
        const usertable = await userTables.findOne({ where: { name: userTableName } });
        let guildtable = await guildTables.findOne({ where: { name: guildTableName } });

        // Check if message includes § (character used to split infractions)
        if (reason.includes('§')) {
            return interaction.reply({ content: 'This warn contains illegal characters "§"', ephemeral: true });
        // Check perms with permcheck from ../functions.js
        } else if (await permcheck({ interaction: interaction, member: member, selfcheck: true, permflag: Permissions.FLAGS.MODERATE_MEMBERS, roleposcheck: false })) {
            return;
        }
        // Check for a guildtable
        if (!guildtable) {
            // If there's no guildtable make one
            await guildTableCreate(guildTableName);
            // Reassign guildtable
            guildtable = await guildTables.findOne({ where: { name: guildTableName } });
        }
        // Get maxinfractions from the guildtable
        const maxinf = await guildtable.get('maxinfractions');

        // Check for a usertable
        if (usertable) {
            // Assign infractions
            let infractions = usertable.get('infractions');
            if (infractions != null) {
                infractions = infractions.split('§');
                infractions.push(reason);
            } else {
                infractions = reason;
                infractions = infractions.split('§');
            }
            // Send warned message
            await interaction.reply(`${user} has been warned for "${interaction.options.getString('reason')}"`);
            member.send(`You have been warned in ${interaction.guild.name} for "${interaction.options.getString('reason')}"`);
            // If the member is in the server and they have more or equal to maxinfractions, ban them
            if (member && maxinf != -1 && infractions.length >= maxinf) {
                // FollowUp with a ban message
                await interaction.followUp(`${member.user} has been banned for "Too many infractions."`);
                // Send a message to the user saying they've been banned
                member.send(`You have been banned from ${interaction.guild.name} for "Too many infractions."`);
                // Ban the user
                member.ban({ days: 0, reason: 'Too many infractions.' });
            }
            infractions = infractions.join('§');
            await userTables.update({ infractions: infractions }, { where: { name: userTableName } });
        } else {
            // Create a usertable and add the infraction to it
            await userTableCreate(userTableName, reason);
            userTables.sync();
            // Send warned message
            await interaction.reply(`${user} has been warned for "${interaction.options.getString('reason')}"`);
            member.send(`You have been warned in ${interaction.guild.name} for "${interaction.options.getString('reason')}"`);
            // If the member is in the server and they have more or equal to maxinfractions, ban them
            if (member && maxinf != -1 && maxinf <= 1) {
                // FollowUp with a ban message
                await interaction.followUp(`${user} has been banned for "Too many infractions."`);
                // Send a message to the user saying they've been banned
                member.send(`You have been banned from ${interaction.guild.name} for "Too many infractions."`);
                // Ban the user
                member.ban({ days: 0, reason: 'Too many infractions.' });
            }
        }
	},
};
