const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getRandomIntInclusive } = require('../../functions');

const a = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again. ',
    `Don't count on it.`,
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.',
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription("Answer's your questions for you.")
        .addStringOption(option => option.setName('question').setDescription('Question to answer')),
	async execute(interaction) {
		// Reply with pong
        const q = interaction.options.getString('question');
		const i = getRandomIntInclusive(0, 19);
        let ebemb = new MessageEmbed()
            // CHANGE 8BALL IMAGE
            .setColor('#f57ae0')
            .setAuthor({ name: '8ball', iconURL: 'https://dm61q01mhxuli.cloudfront.net/images/m135/image2/500-gt-4025.jpg' });
        if (q) {
            ebemb = ebemb.addField(`${q}`, `${a[i]}`);
        } else {
            ebemb = ebemb.setDescription(a[i]);
        }
        interaction.reply({ embeds: [ebemb] });
	},
};
