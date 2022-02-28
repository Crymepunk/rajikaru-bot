function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        const wait = require('util').promisify(setTimeout);
		let lastoutcome = 99;
        // eslint-disable-next-line no-constant-condition
        while (true) {
			const outcome = getRandomIntInclusive(0, 5);
			if (lastoutcome != outcome && outcome == 0) {
				client.user.setActivity('your mom', { type: 'LISTENING' });
				console.log('Set Activity to "Listening to your mom"');
				lastoutcome = 0;
				await wait(7200000);
			} else if (lastoutcome != outcome && outcome == 1) {
				client.user.setActivity('The Game');
				console.log('Set Activity to "Playing The Game"');
				lastoutcome = 1;
				await wait(600000);
			} else if (lastoutcome != outcome && outcome == 2) {
				client.user.setActivity('Genshin Impact');
				console.log('Set Activity to "Playing Genshin Impact"');
				lastoutcome = 2;
				await wait(7200000);
			} else if (lastoutcome != outcome && outcome == 3) {
				client.user.setActivity('Attack on Titan', { type: 'WATCHING' });
				console.log('Set Activity to "Watching Attack on Titan"');
				lastoutcome = 3;
				await wait(7200000);
			} else if (lastoutcome != outcome && outcome == 4) {
				client.user.setActivity('/help', { type: 'LISTENING' });
				console.log('Set Activity to "Listening to /help"');
				lastoutcome = 4;
				await wait(7200000);
			} else if (lastoutcome != outcome && outcome == 5) {
				client.user.setActivity('SIFU');
				console.log('Set Activity to "Playing SIFU"');
				lastoutcome = 5;
				await wait(7200000);
			}
        }
	},
};
