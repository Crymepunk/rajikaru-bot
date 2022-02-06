const { SlashCommandBuilder } = require('@discordjs/builders');
const { userTable, guildTable, userTableCreate, guildTableCreate } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warns the pinged member')
        .addUserOption(option => option.setName('member').setDescription('User to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for warning').setRequired(true)),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason');
        const tableName = `${interaction.guild.id}-${member.id}`;
        const usertable = await userTable.findOne({ where: { name: tableName } });
        const guildtable = await guildTable.findOne({ where: { name: interaction.guild.id } });

        if (interaction.guild == null) {
            return interaction.reply('This command only works in Guilds!');
        } else if (reason.includes('§')) {
            return interaction.reply({ content: 'This warn contains illegal characters "§"', ephemeral: true });
        }

        if (!guildtable) {
            guildTableCreate({ name: interaction.guild.id });
        }

        if (usertable) {
            let infractions = usertable.get('infractions');
            infractions = infractions.split('§');
            infractions.push(reason);
            interaction.reply(`${member.user} has been warned for "${reason}"`);
            if (infractions.length >= guildtable.get('maxinfractions')) {
                await interaction.followUp(`${member.user} has been banned for "Too many infractions."`);
                member.ban({ days: 0, reason: 'Too many infractions.' });
            }
            infractions = infractions.join('§');
            await userTable.update({ infractions: infractions }, { where: { name: tableName } });
        } else {
            userTableCreate(tableName, reason);
            userTable.sync();
            await interaction.reply(`${member.user} has been warned for "${reason}"`);
            if (guildtable.get('maxinfractions') <= 1) {
                await interaction.followUp(`${member.user} has been banned for "Too many infractions."`);
                member.ban({ days: 0, reason: 'Too many infractions.' });
            }
        }
	},
};
