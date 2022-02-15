module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		if (interaction.guild != null) {
			console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
		} else {
			console.log(`${interaction.user.tag} in DMs triggered an interaction.`);
		}
	},
};
