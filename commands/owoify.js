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

        if (contentcheck(message)) {
            await interaction.reply({ content: 'This conytainys a bad wowd.', ephemeral: true });
        } else {
            message = objToString(await neko.sfw.OwOify({ text: message }));
            await interaction.reply(message);
        }
	},
};
