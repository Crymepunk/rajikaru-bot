const { SlashCommandBuilder } = require('@discordjs/builders');
const { userTables, userTableCreate } = require('../functions');

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
        const usertable = await userTables.findOne({ where: { name: tableName } });

        if (reason.includes('§')) {
            return interaction.reply({ content: 'This warn contains illegal characters "§"', ephemeral: true });
        }
        if (usertable) {
            let infractions = usertable.get('infractions');
            infractions = infractions.split('§');
            if (infractions.length(usertable.get('maxinfractions'))) {
                await interaction.reply(`${member.user} has been banned for "Too many infractions."`);
                member.ban({ days: 0, reason: 'Too many infractions.' });
            } else {
                infractions.push(reason);
                infractions = infractions.join('§');
                await userTables.update({ infractions: infractions }, { where: { name: tableName } });
                interaction.reply(`${member.user} has been warned for "${reason}"`);
            }
        } else {
            userTableCreate(tableName, reason, 3);
            userTables.sync();
            return interaction.reply(`${member.user} has been warned for "${reason}"`);
        }
	},
};
