const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('nekos.life');
const neko = new client();

function objToString(object) {
    let str = '';
    for (const k in object) {
        // eslint-disable-next-line no-prototype-builtins
        if (object.hasOwnProperty(k)) {
            str += object[k];
        }
    }
    return str;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('owoify')
		.setDescription('Owoifies your text.')
        .addStringOption(option => option.setName('message').setDescription('Message to say').setRequired(true)),
	async execute(interaction) {
        let message = interaction.options.getString('message');
        message = objToString(await neko.sfw.OwOify({ text: message }));
		await interaction.reply(message);
	},
};
