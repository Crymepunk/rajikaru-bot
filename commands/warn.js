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
        const reason = interaction.options.getString('reason');
        const userTableName = `${interaction.guild.id}-${member.id}`;
        const guildTableName = String(interaction.guild.id + '-guild');
        const usertable = await userTables.findOne({ where: { name: userTableName } });
        let guildtable = await guildTables.findOne({ where: { name: guildTableName } });
        const modrole = await guildtable.get('modrole');
        const manrole = await guildtable.get('manrole');
        interaction.deferReply();

        if (interaction.guild == null) {
            return interaction.reply('This command only works in Guilds!');
        } else if (reason.includes('§')) {
            return interaction.reply({ content: 'This warn contains illegal characters "§"', ephemeral: true });
        } else if (interaction.member == member) {
            return interaction.reply({ content: 'Please ping someone else to warn.', ephemeral: true });
        } else if (contentcheck(member._roles, [manrole, modrole])) {
            return interaction.reply({ content: 'Cannot warn a Moderator.', ephemeral: true });
        } else if (contentcheck(interaction.member._roles, [manrole, modrole]) || interaction.member == interaction.guild.fetchOwner()) {
            if (!guildtable) {
                await guildTableCreate(guildTableName);
                console.log(guildtable = await guildTables.findOne({ where: { name: guildTableName } }));
            }

            if (usertable) {
                let infractions = usertable.get('infractions');
                infractions = infractions.split('§');
                infractions.push(reason);
                interaction.reply(`${member.user} has been warned for "${reason}"`);
                if (infractions.length >= await guildtable.get('maxinfractions')) {
                    await interaction.followUp(`${member.user} has been banned for "Too many infractions."`);
                    member.ban({ days: 0, reason: 'Too many infractions.' });
                }
                infractions = infractions.join('§');
                await userTables.update({ infractions: infractions }, { where: { name: userTableName } });
            } else {
                await userTableCreate(userTableName, reason);
                userTables.sync();
                await interaction.reply(`${member.user} has been warned for "${reason}"`);
                if (await guildtable.get('maxinfractions') <= 1) {
                    await interaction.followUp(`${member.user} has been banned for "Too many infractions."`);
                    member.ban({ days: 0, reason: 'Too many infractions.' });
                }
            }
        } else {
            await interaction.reply('Permission denied');
        }
	},
};
