const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('nekos.life');
const neko = new client();

function contentcheck(message, filter) {
	const len = filter.length;
	for (let i = 0; i < len; i++) {
		if (message.includes(filter[i])) {
			return true;
		}
	}
	return false;
}

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
        const filter = ['nigger', 'niggër', 'niggêr', 'nigg3r', 'nïgger', 'nïggër', 'nïggêr', 'nïgg3r', 'nîgger', 'nîggër', 'nîggêr', 'nîgg3r', 'n1gger', 'n1ggër', 'n1ggêr', 'n1gg3r'];

        if (contentcheck(message, filter)) {
            await interaction.reply({ content: 'This conytainys a bad wowd.', ephemeral: true });
        } else {
            message = objToString(await neko.sfw.OwOify({ text: message }));
            await interaction.reply(message);
        }
	},
};
