const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('nekos.life');
const { objToString, contentcheck } = require('../functions');
const neko = new client();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('owoify')
		.setDescription('Owoifies your text.')
        .addStringOption(option => option.setName('message').setDescription('Message to say').setRequired(true)),
	async execute(interaction) {
        let message = interaction.options.getString('message');
        message = objToString(await neko.sfw.OwOify({ text: message }));

        if (!interaction.guild) {
            await interaction.reply(message);
        } else if (contentcheck(message, ['nigger', 'niggër', 'niggêr', 'nigg3r', 'nïgger', 'nïggër', 'nïggêr', 'nïgg3r', 'nîgger', 'nîggër', 'nîggêr', 'nîgg3r', 'n1gger', 'n1ggër', 'n1ggêr', 'n1gg3r'])) {
            await interaction.reply({ content: 'This conytainys a bad wowd.', ephemeral: true });
        } else {
            await interaction.reply(message);
        }
	},
};
