const { SlashCommandBuilder } = require('@discordjs/builders');
const { userTables, guildTables, userTableCreate, guildTableCreate, contentcheck } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warns the pinged member')
        .addUserOption(option => option.setName('member').setDescription('User to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for warning').setRequired(true)),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const user = interaction.options.getUser('member');
        const reason = `**${interaction.options.getString('reason')}** • <t:${Math.floor(new Date().getTime() / 1000)}:R>`;
        const owner = await interaction.guild.fetchOwner();
        const userTableName = `${interaction.guild.id}-${user.id}`;
        const guildTableName = String(interaction.guild.id + '-guild');
        const usertable = await userTables.findOne({ where: { name: userTableName } });
        let guildtable = await guildTables.findOne({ where: { name: guildTableName } });
        let modrole = null;
        let manrole = null;

        if (guildtable) {
            modrole = await guildtable.get('modrole');
            manrole = await guildtable.get('manrole');
        }

        if (interaction.guild == null) {
            return interaction.reply('This command only works in Guilds!');
        } else if (reason.includes('§')) {
            return interaction.reply({ content: 'This warn contains illegal characters "§"', ephemeral: true });
        } else if (member) {
            if (interaction.member == member) {
                return interaction.reply({ content: 'Please ping someone else to warn.', ephemeral: true });
            } else if (contentcheck(member._roles, [manrole, modrole]) || member == owner) {
                return interaction.reply({ content: 'Cannot warn a Moderator.', ephemeral: true });
            }
        }
        if (contentcheck(interaction.member._roles, [manrole, modrole]) || interaction.member == owner) {
            if (!guildtable) {
                await guildTableCreate(guildTableName);
                guildtable = await guildTables.findOne({ where: { name: guildTableName } });
            }
            const maxinf = await guildtable.get('maxinfractions');

            if (usertable) {
                let infractions = usertable.get('infractions');
                if (infractions != null) {
                    infractions = infractions.split('§');
                    infractions.push(reason);
                } else {
                    infractions = reason;
                    infractions = infractions.split('§');
                }
                await interaction.reply(`${user} has been warned for "${interaction.options.getString('reason')}"`);
                if (member && maxinf != -1 && infractions.length >= maxinf) {
                    await interaction.followUp(`${member.user} has been banned for "Too many infractions."`);
                    member.send(`You have been banned from ${interaction.guild.name} for "Too many infractions."`);
                    member.ban({ days: 0, reason: 'Too many infractions.' });
                }
                infractions = infractions.join('§');
                await userTables.update({ infractions: infractions }, { where: { name: userTableName } });
            } else {
                await userTableCreate(userTableName, reason);
                userTables.sync();
                await interaction.reply(`${member.user} has been warned for "${interaction.options.getString('reason')}"`);
                member.send(`You have been warned in ${interaction.guild.name} for "${interaction.options.getString('reason')}"`);
                if (member && maxinf != -1 && maxinf <= 1) {
                    await interaction.followUp(`${user} has been banned for "Too many infractions."`);
                    member.send(`You have been banned from ${interaction.guild.name} for "Too many infractions."`);
                    member.ban({ days: 0, reason: 'Too many infractions.' });
                }
            }
        } else {
            return interaction.reply({ content: "Permission denied", ephemeral: true });
        }
	},
};
