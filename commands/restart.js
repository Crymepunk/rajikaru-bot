const { SlashCommandBuilder } = require('@discordjs/builders');
const { uid } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restarts the bot.'),
	async execute(interaction) {
        if (interaction.user.id == uid) {
            await interaction.reply('Restarting...');
            process.exit();
        }
	},
};
