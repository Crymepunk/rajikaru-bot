const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('pull')
		.setDescription('Pulls newest bot revision from github!'),
	async execute(interaction) {
		if (interaction.user.id == '769632057575342081') {
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
			await interaction.reply('Please dont.');
		}
	},
};
