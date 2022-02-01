const { SlashCommandBuilder } = require('@discordjs/builders');
const { uid } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pull')
		.setDescription('Pulls the latest version from github.'),
	async execute(interaction) {
		if (interaction.user.id == uid) {
			const { exec } = require("child_process");
			exec("git pull", (error, stdout, stderr) => {
				if (error) {
					interaction.reply({ content: `error: ${error.message}`, ephemeral: true });
					return;
				}
				if (stderr) {
					interaction.reply({ content: `stderr: ${stderr}`, ephemeral: true });
					return;
				}
				interaction.reply({ content: `stdout: ${stdout}`, ephemeral: true });
			});
		} else {
			return;
		}
	},
};
