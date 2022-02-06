const { SlashCommandBuilder } = require('@discordjs/builders');
const { userTables } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('infractions')
		.setDescription('How many infractions the user has and what they are.')
        .addUserOption(option => option.setName('user').setDescription('User to check.').setRequired(true)),
	async execute(interaction) {
        const user = interaction.options.getUser('user');
        const tableName = `${interaction.guild.id}-${user.id}`;
        const usertable = await userTables.findOne({ where: { name: tableName } });
        if (usertable) {
            const infractions = usertable.get('infractions');
            interaction.reply(infractions);
        } else {
            interaction.reply('This user doesnt exist/doesnt have any infractions.');
        }
	},
};
